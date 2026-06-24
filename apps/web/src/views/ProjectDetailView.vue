<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import {
  assetsApi,
  colorsApi,
  downloadAsset,
  palettesApi,
  projectsApi,
  typographiesApi,
} from "../api/services";
import type {
  BrandProject,
  ColorPalette,
  PaletteColor,
  Typography,
  VisualAsset,
} from "../types";
import { getErrorMessage, sanitizeOptionalText } from "../api/client";
import { useToast } from "../composables/useToast";
import { useFormErrors } from "../composables/useFormErrors";
import FormField from "../components/FormField.vue";
import { copyToClipboard, formatFileSize, hexToRgb } from "../utils/helpers";
import AssetImage from "../components/AssetImage.vue";
import StatusBadge from "../components/StatusBadge.vue";
import LoadingSpinner from "../components/LoadingSpinner.vue";
import AppButton from "../components/AppButton.vue";
import { useSubmitting } from "../composables/useSubmitting";
import { useConfirm } from "../composables/useConfirm";

const route = useRoute();
const { show } = useToast();
const { confirm } = useConfirm();
const paletteErrors = useFormErrors();
const colorErrors = useFormErrors();
const typographyErrors = useFormErrors();
const assetErrors = useFormErrors();
const { submitting: savingPalette, run: runSavePalette } = useSubmitting();
const { submitting: deletingPalette, run: runDeletePalette } = useSubmitting();
const { submitting: savingColor, run: runSaveColor } = useSubmitting();
const { submitting: savingTypography, run: runSaveTypography } =
  useSubmitting();
const { submitting: uploadingAsset, run: runUploadAsset } = useSubmitting();
const projectId = computed(() => route.params.id as string);

const project = ref<BrandProject | null>(null);
const activeTab = ref<"palettes" | "typography" | "assets">("palettes");
const loading = ref(true);

const palettes = ref<ColorPalette[]>([]);
const selectedPalette = ref<ColorPalette | null>(null);
const colors = ref<PaletteColor[]>([]);
const typographies = ref<Typography[]>([]);
const assets = ref<VisualAsset[]>([]);

const showPaletteModal = ref(false);
const showColorModal = ref(false);
const showTypographyModal = ref(false);
const editingTypography = ref<Typography | null>(null);
const dragIndex = ref<number | null>(null);

const paletteForm = ref({ name: "", description: "", isPrimary: false });
const colorForm = ref({
  name: "",
  hexCode: "#BB3F95",
  rgbValue: "rgb(187,63,149)",
  cmykValue: "",
});
const typographyForm = ref({
  name: "",
  fontFamily: "Inter",
  provider: "Google Fonts",
  category: "sans-serif",
  weightMin: 400,
  weightMax: 700,
});

const assetForm = ref({ name: "", assetType: "LOGO" });
const fileInputRef = ref<HTMLInputElement | null>(null);
const stagedFile = ref<File | null>(null);
const stagedPreviewUrl = ref<string | null>(null);

async function loadProject() {
  loading.value = true;
  try {
    project.value = await projectsApi.get(projectId.value);
    await Promise.all([loadPalettes(), loadTypographies(), loadAssets()]);
  } catch (err) {
    show(getErrorMessage(err), "error");
  } finally {
    loading.value = false;
  }
}

async function loadPalettes() {
  palettes.value = await palettesApi.list(projectId.value);
  if (selectedPalette.value) {
    selectedPalette.value =
      palettes.value.find((p) => p.id === selectedPalette.value?.id) ??
      palettes.value[0] ??
      null;
  } else {
    selectedPalette.value = palettes.value[0] ?? null;
  }
  if (selectedPalette.value) await loadColors(selectedPalette.value.id);
}

async function loadColors(paletteId: string) {
  colors.value = await colorsApi.list(paletteId);
}

async function loadTypographies() {
  typographies.value = await typographiesApi.list(projectId.value);
}

async function loadAssets() {
  assets.value = await assetsApi.list(projectId.value);
}

onMounted(loadProject);

async function savePalette() {
  await runSavePalette(async () => {
    paletteErrors.clearFieldErrors();
    try {
      await palettesApi.create(projectId.value, {
        name: paletteForm.value.name.trim(),
        description: sanitizeOptionalText(paletteForm.value.description),
        isPrimary: paletteForm.value.isPrimary,
      });
      show("Paleta criada");
      showPaletteModal.value = false;
      paletteForm.value = { name: "", description: "", isPrimary: false };
      await loadPalettes();
    } catch (err) {
      paletteErrors.applyFieldErrors(err);
      show(getErrorMessage(err), "error");
      throw err;
    }
  });
}

async function selectPalette(palette: ColorPalette) {
  selectedPalette.value = palette;
  await loadColors(palette.id);
}

async function deletePalette(palette: ColorPalette, event?: Event) {
  event?.stopPropagation();
  const accepted = await confirm({
    title: "Excluir paleta",
    message: `A paleta "${palette.name}" e todas as suas cores serão removidas permanentemente. Esta ação não pode ser desfeita.`,
    confirmLabel: "Excluir",
    cancelLabel: "Cancelar",
  });
  if (!accepted) return;

  await runDeletePalette(async () => {
    try {
      await palettesApi.remove(projectId.value, palette.id);
      show("Paleta excluída");
      if (selectedPalette.value?.id === palette.id) {
        selectedPalette.value = null;
        colors.value = [];
      }
      await loadPalettes();
    } catch (err) {
      show(getErrorMessage(err), "error");
      throw err;
    }
  });
}

async function saveColor() {
  if (!selectedPalette.value) return;
  await runSaveColor(async () => {
    colorErrors.clearFieldErrors();
    try {
      const payload = {
        name: colorForm.value.name.trim(),
        hexCode: colorForm.value.hexCode,
        rgbValue: colorForm.value.rgbValue || hexToRgb(colorForm.value.hexCode),
        cmykValue: sanitizeOptionalText(colorForm.value.cmykValue),
      };
      await colorsApi.create(selectedPalette.value!.id, payload);
      show("Cor adicionada");
      showColorModal.value = false;
      colorForm.value = {
        name: "",
        hexCode: "#BB3F95",
        rgbValue: "rgb(187,63,149)",
        cmykValue: "",
      };
      await loadColors(selectedPalette.value!.id);
    } catch (err) {
      colorErrors.applyFieldErrors(err);
      show(getErrorMessage(err), "error");
      throw err;
    }
  });
}

async function deleteColor(colorId: string) {
  if (!selectedPalette.value) return;
  const color = colors.value.find((item) => item.id === colorId);
  const accepted = await confirm({
    title: "Excluir cor",
    message: color
      ? `A cor "${color.name}" será removida da paleta "${selectedPalette.value.name}". Esta ação não pode ser desfeita.`
      : "Esta cor será removida da paleta. Esta ação não pode ser desfeita.",
    confirmLabel: "Excluir",
    cancelLabel: "Cancelar",
  });
  if (!accepted) return;
  try {
    await colorsApi.remove(selectedPalette.value.id, colorId);
    show("Cor removida");
    await loadColors(selectedPalette.value.id);
  } catch (err) {
    show(getErrorMessage(err), "error");
  }
}

async function moveColor(index: number, direction: -1 | 1) {
  if (!selectedPalette.value) return;
  const newIndex = index + direction;
  if (newIndex < 0 || newIndex >= colors.value.length) return;
  const reordered = [...colors.value];
  const [item] = reordered.splice(index, 1);
  reordered.splice(newIndex, 0, item);
  await persistOrder(reordered);
}

async function persistOrder(reordered: PaletteColor[]) {
  if (!selectedPalette.value) return;
  try {
    colors.value = await colorsApi.reorder(
      selectedPalette.value.id,
      reordered.map((c) => c.id),
    );
  } catch (err) {
    show(getErrorMessage(err), "error");
  }
}

function onDragStart(index: number) {
  dragIndex.value = index;
}

function onDrop(index: number) {
  if (dragIndex.value === null || dragIndex.value === index) return;
  const reordered = [...colors.value];
  const [item] = reordered.splice(dragIndex.value, 1);
  reordered.splice(index, 0, item);
  dragIndex.value = null;
  persistOrder(reordered);
}

function onHexChange() {
  colorForm.value.rgbValue = hexToRgb(colorForm.value.hexCode);
}

async function copyHex(hex: string) {
  await copyToClipboard(hex);
  show("Cor copiada!");
}

function openTypographyModal(item?: Typography) {
  typographyErrors.clearFieldErrors();
  editingTypography.value = item ?? null;
  if (item) {
    typographyForm.value = {
      name: item.name,
      fontFamily: item.fontFamily,
      provider: item.provider,
      category: item.category ?? "sans-serif",
      weightMin: item.weightMin ?? 400,
      weightMax: item.weightMax ?? 700,
    };
  } else {
    typographyForm.value = {
      name: "",
      fontFamily: "Inter",
      provider: "Google Fonts",
      category: "sans-serif",
      weightMin: 400,
      weightMax: 700,
    };
  }
  showTypographyModal.value = true;
}

async function saveTypography() {
  await runSaveTypography(async () => {
    typographyErrors.clearFieldErrors();
    const payload = {
      name: typographyForm.value.name.trim(),
      fontFamily: typographyForm.value.fontFamily.trim(),
      provider: typographyForm.value.provider.trim(),
      category: sanitizeOptionalText(typographyForm.value.category),
      weightMin: typographyForm.value.weightMin,
      weightMax: typographyForm.value.weightMax,
    };

    try {
      if (editingTypography.value) {
        await typographiesApi.update(
          projectId.value,
          editingTypography.value.id,
          payload,
        );
        show("Tipografia atualizada");
      } else {
        await typographiesApi.create(projectId.value, payload);
        show("Tipografia criada");
      }
      showTypographyModal.value = false;
      await loadTypographies();
    } catch (err) {
      typographyErrors.applyFieldErrors(err);
      show(getErrorMessage(err), "error");
      throw err;
    }
  });
}

async function deleteTypography(id: string) {
  const typography = typographies.value.find((item) => item.id === id);
  const accepted = await confirm({
    title: "Excluir tipografia",
    message: typography
      ? `A tipografia "${typography.name}" (${typography.fontFamily}) será removida do projeto. Esta ação não pode ser desfeita.`
      : "Esta tipografia será removida do projeto. Esta ação não pode ser desfeita.",
    confirmLabel: "Excluir",
    cancelLabel: "Cancelar",
  });
  if (!accepted) return;
  try {
    await typographiesApi.remove(projectId.value, id);
    show("Tipografia removida");
    await loadTypographies();
  } catch (err) {
    show(getErrorMessage(err), "error");
  }
}

function clearStagedFile() {
  if (stagedPreviewUrl.value) {
    URL.revokeObjectURL(stagedPreviewUrl.value);
  }
  stagedFile.value = null;
  stagedPreviewUrl.value = null;
  if (fileInputRef.value) {
    fileInputRef.value.value = "";
  }
}

function openFilePicker() {
  fileInputRef.value?.click();
}

function onFileStaged(event: Event) {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;

  clearStagedFile();
  stagedFile.value = file;
  if (file.type.startsWith("image/")) {
    stagedPreviewUrl.value = URL.createObjectURL(file);
  }
  input.value = "";
}

async function uploadAsset() {
  await runUploadAsset(async () => {
    assetErrors.clearFieldErrors();
    if (!stagedFile.value) {
      assetErrors.fieldErrors.value.file = "Selecione um arquivo para enviar.";
      show("Selecione um arquivo", "error");
      return;
    }
    try {
      await assetsApi.upload(
        projectId.value,
        stagedFile.value,
        assetForm.value.name.trim() || stagedFile.value.name,
        assetForm.value.assetType,
      );
      show("Asset enviado");
      assetForm.value = { name: "", assetType: "LOGO" };
      clearStagedFile();
      await loadAssets();
    } catch (err) {
      assetErrors.applyFieldErrors(err);
      show(getErrorMessage(err), "error");
      throw err;
    }
  });
}

onBeforeUnmount(() => {
  clearStagedFile();
});

async function deleteAsset(id: string) {
  const asset = assets.value.find((item) => item.id === id);
  const accepted = await confirm({
    title: "Excluir asset",
    message: asset
      ? `O asset "${asset.name}" será removido permanentemente do projeto. Esta ação não pode ser desfeita.`
      : "Este asset será removido permanentemente do projeto. Esta ação não pode ser desfeita.",
    confirmLabel: "Excluir",
    cancelLabel: "Cancelar",
  });
  if (!accepted) return;
  try {
    await assetsApi.remove(projectId.value, id);
    show("Asset removido");
    await loadAssets();
  } catch (err) {
    show(getErrorMessage(err), "error");
  }
}

async function handleDownload(asset: VisualAsset) {
  try {
    await downloadAsset(asset.fileKey, asset.name);
  } catch (err) {
    show(getErrorMessage(err), "error");
  }
}

function isImage(mime?: string | null) {
  return mime?.startsWith("image/") ?? false;
}
</script>

<template>
  <div class="flex flex-col h-full overflow-hidden">
    <header
      class="h-16 bg-surface border-b border-border-subtle flex items-center px-6 lg:px-10 shrink-0"
    >
      <div>
        <nav class="flex items-center gap-2 text-xs text-text-muted mb-0.5">
          <RouterLink to="/projects" class="hover:text-primary"
            >Projetos</RouterLink
          >
          <span class="material-symbols-outlined text-[14px]"
            >chevron_right</span
          >
          <span>{{ project?.name ?? "..." }}</span>
        </nav>
        <h2 class="font-bold text-lg text-text-main">
          {{ project?.name ?? "Carregando..." }}
        </h2>
      </div>
    </header>

    <main class="flex-1 overflow-y-auto p-6 lg:p-10">
      <div
        v-if="loading"
        class="flex items-center gap-3 text-text-muted text-sm py-8"
      >
        <LoadingSpinner />
        Carregando projeto...
      </div>

      <div v-else-if="project" class="w-full flex flex-col gap-6">
        <div class="bg-surface border border-border-subtle rounded p-5">
          <div class="flex flex-wrap items-start justify-between gap-4">
            <div>
              <StatusBadge :status="project.status" />
              <p class="mt-2 text-sm text-text-muted">
                {{ project.description || "Sem descrição" }}
              </p>
            </div>
          </div>
        </div>

        <div class="border-b border-border-subtle flex gap-1">
          <button
            v-for="tab in [
              { id: 'palettes', label: 'Paletas', icon: 'palette' },
              { id: 'typography', label: 'Tipografias', icon: 'text_fields' },
              { id: 'assets', label: 'Assets', icon: 'image' },
            ]"
            :key="tab.id"
            class="flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors"
            :class="
              activeTab === tab.id
                ? 'border-primary text-primary'
                : 'border-transparent text-text-muted hover:text-text-main'
            "
            @click="activeTab = tab.id as typeof activeTab"
          >
            <span class="material-symbols-outlined text-[18px]">{{
              tab.icon
            }}</span>
            {{ tab.label }}
          </button>
        </div>

        <!-- Palettes tab -->
        <section
          v-if="activeTab === 'palettes'"
          class="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          <div
            class="lg:col-span-1 bg-surface border border-border-subtle rounded p-4"
          >
            <div class="flex items-center justify-between mb-4">
              <h3 class="font-semibold">Paletas</h3>
              <button
                class="text-primary text-sm font-medium"
                @click="
                  paletteErrors.clearFieldErrors();
                  showPaletteModal = true;
                "
              >
                + Nova
              </button>
            </div>
            <div v-if="palettes.length === 0" class="text-sm text-text-muted">
              Nenhuma paleta.
            </div>
            <div
              v-for="palette in palettes"
              :key="palette.id"
              class="flex items-stretch gap-1 mb-2"
            >
              <button
                class="flex-1 text-left p-3 rounded border transition-colors"
                :class="
                  selectedPalette?.id === palette.id
                    ? 'border-primary bg-primary/5'
                    : 'border-border-subtle hover:border-primary/50'
                "
                @click="selectPalette(palette)"
              >
                <div class="flex items-center justify-between gap-2">
                  <span class="font-medium text-sm">{{ palette.name }}</span>
                  <span
                    v-if="palette.isPrimary"
                    class="text-[10px] uppercase tracking-wider text-primary font-bold shrink-0"
                    >Primária</span
                  >
                </div>
              </button>
              <button
                type="button"
                class="px-2 text-text-muted hover:text-error disabled:opacity-40 border border-border-subtle rounded shrink-0"
                :disabled="deletingPalette"
                aria-label="Excluir paleta"
                @click="deletePalette(palette, $event)"
              >
                <span class="material-symbols-outlined text-[18px]"
                  >delete</span
                >
              </button>
            </div>
          </div>

          <div
            class="lg:col-span-2 bg-surface border border-border-subtle rounded p-4"
          >
            <div v-if="!selectedPalette" class="text-sm text-text-muted">
              Selecione ou crie uma paleta.
            </div>
            <template v-else>
              <div class="flex items-center justify-between mb-4 gap-3">
                <h3 class="font-semibold">{{ selectedPalette.name }}</h3>
                <div class="flex items-center gap-3">
                  <button
                    class="text-primary text-sm font-medium"
                    @click="
                      colorErrors.clearFieldErrors();
                      showColorModal = true;
                    "
                  >
                    + Cor
                  </button>
                </div>
              </div>
              <div v-if="colors.length === 0" class="text-sm text-text-muted">
                Nenhuma cor nesta paleta.
              </div>
              <div v-else class="flex flex-col gap-2">
                <div
                  v-for="(color, index) in colors"
                  :key="color.id"
                  draggable="true"
                  class="flex items-center gap-3 p-3 border border-border-subtle rounded bg-background-light cursor-grab active:cursor-grabbing"
                  @dragstart="onDragStart(index)"
                  @dragover.prevent
                  @drop="onDrop(index)"
                >
                  <span
                    class="material-symbols-outlined text-text-muted text-[18px]"
                    >drag_indicator</span
                  >
                  <div
                    class="w-10 h-10 rounded border border-border-subtle shrink-0"
                    :style="{ backgroundColor: color.hexCode }"
                  />
                  <div class="flex-1 min-w-0">
                    <p class="font-medium text-sm">{{ color.name }}</p>
                    <p class="text-xs font-mono text-text-muted">
                      {{ color.hexCode }}
                    </p>
                  </div>
                  <div class="flex items-center gap-1">
                    <button
                      class="p-1 text-text-muted hover:text-primary"
                      :disabled="index === 0"
                      @click="moveColor(index, -1)"
                    >
                      <span class="material-symbols-outlined text-[18px]"
                        >arrow_upward</span
                      >
                    </button>
                    <button
                      class="p-1 text-text-muted hover:text-primary"
                      :disabled="index === colors.length - 1"
                      @click="moveColor(index, 1)"
                    >
                      <span class="material-symbols-outlined text-[18px]"
                        >arrow_downward</span
                      >
                    </button>
                    <button
                      class="p-1 text-text-muted hover:text-primary"
                      @click="copyHex(color.hexCode)"
                    >
                      <span class="material-symbols-outlined text-[18px]"
                        >content_copy</span
                      >
                    </button>
                    <button
                      class="p-1 text-text-muted hover:text-error"
                      @click="deleteColor(color.id)"
                    >
                      <span class="material-symbols-outlined text-[18px]"
                        >delete</span
                      >
                    </button>
                  </div>
                </div>
              </div>
            </template>
          </div>
        </section>

        <!-- Typography tab -->
        <section
          v-if="activeTab === 'typography'"
          class="bg-surface border border-border-subtle rounded p-4"
        >
          <div class="flex items-center justify-between mb-4">
            <h3 class="font-semibold">Tipografias</h3>
            <button
              class="text-primary text-sm font-medium"
              @click="openTypographyModal()"
            >
              + Nova
            </button>
          </div>
          <div v-if="typographies.length === 0" class="text-sm text-text-muted">
            Nenhuma tipografia.
          </div>
          <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              v-for="item in typographies"
              :key="item.id"
              class="border border-border-subtle rounded p-4"
            >
              <div class="flex justify-between items-start mb-3">
                <div>
                  <p class="font-semibold">{{ item.name }}</p>
                  <p class="text-xs text-text-muted">
                    {{ item.provider }} · {{ item.category }}
                  </p>
                </div>
                <div class="flex gap-1">
                  <button
                    class="text-text-muted hover:text-primary"
                    @click="openTypographyModal(item)"
                  >
                    <span class="material-symbols-outlined text-[18px]"
                      >edit</span
                    >
                  </button>
                  <button
                    class="text-text-muted hover:text-error"
                    @click="deleteTypography(item.id)"
                  >
                    <span class="material-symbols-outlined text-[18px]"
                      >delete</span
                    >
                  </button>
                </div>
              </div>
              <p class="text-2xl" :style="{ fontFamily: item.fontFamily }">
                Aa Bb Cc 123
              </p>
              <p class="text-xs text-text-muted mt-2">
                Peso {{ item.weightMin }}–{{ item.weightMax }}
              </p>
            </div>
          </div>
        </section>

        <!-- Assets tab -->
        <section v-if="activeTab === 'assets'" class="flex flex-col gap-6">
          <div class="bg-surface border border-border-subtle rounded p-4">
            <h3 class="font-semibold mb-4">Enviar asset</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Nome"
                optional
                :error="assetErrors.fieldError('name')"
              >
                <input
                  v-model="assetForm.name"
                  class="w-full h-10 px-3 border rounded text-sm"
                  :class="
                    assetErrors.fieldError('name')
                      ? 'border-error'
                      : 'border-border-subtle'
                  "
                  placeholder="Logo principal"
                />
              </FormField>
              <FormField
                label="Tipo"
                :error="assetErrors.fieldError('assetType')"
              >
                <select
                  v-model="assetForm.assetType"
                  class="w-full h-10 px-3 border border-border-subtle rounded text-sm"
                >
                  <option value="LOGO">Logo</option>
                  <option value="ICON">Ícone</option>
                  <option value="IMAGE">Imagem</option>
                  <option value="MOCKUP">Mockup</option>
                </select>
              </FormField>

              <div class="md:col-span-2">
                <input
                  ref="fileInputRef"
                  type="file"
                  accept="image/*,.pdf,.svg"
                  class="hidden"
                  @change="onFileStaged"
                />

                <div
                  v-if="!stagedFile"
                  class="border border-dashed border-border-subtle rounded p-6 text-center"
                >
                  <span
                    class="material-symbols-outlined text-4xl text-text-muted mb-2"
                    >upload_file</span
                  >
                  <p class="text-sm text-text-muted mb-4">
                    Selecione um arquivo para enviar ao projeto
                  </p>
                  <AppButton variant="secondary" @click="openFilePicker"
                    >Selecionar arquivo</AppButton
                  >
                  <p
                    v-if="assetErrors.fieldError('file')"
                    class="mt-2 text-xs text-error"
                  >
                    {{ assetErrors.fieldError("file") }}
                  </p>
                </div>

                <div
                  v-else
                  class="border border-primary/40 bg-primary/5 rounded p-4"
                >
                  <div class="flex flex-col sm:flex-row gap-4 items-start">
                    <div
                      class="w-full sm:w-32 h-32 bg-surface border border-border-subtle rounded flex items-center justify-center overflow-hidden shrink-0"
                    >
                      <img
                        v-if="stagedPreviewUrl"
                        :src="stagedPreviewUrl"
                        :alt="stagedFile.name"
                        class="max-h-full max-w-full object-contain"
                      />
                      <span
                        v-else
                        class="material-symbols-outlined text-4xl text-text-muted"
                        >description</span
                      >
                    </div>
                    <div class="flex-1 min-w-0">
                      <p class="text-sm font-semibold text-text-main truncate">
                        {{ stagedFile.name }}
                      </p>
                      <p class="text-xs text-text-muted mt-1">
                        {{ formatFileSize(stagedFile.size) }}
                      </p>
                      <div class="flex flex-wrap gap-2 mt-4">
                        <AppButton
                          :loading="uploadingAsset"
                          @click="uploadAsset"
                          >Enviar</AppButton
                        >
                        <AppButton
                          variant="secondary"
                          :disabled="uploadingAsset"
                          @click="openFilePicker"
                          >Trocar arquivo</AppButton
                        >
                        <AppButton
                          variant="ghost"
                          :disabled="uploadingAsset"
                          @click="clearStagedFile"
                          >Remover</AppButton
                        >
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-surface border border-border-subtle rounded p-4">
            <h3 class="font-semibold mb-4">Biblioteca ({{ assets.length }})</h3>
            <div v-if="assets.length === 0" class="text-sm text-text-muted">
              Nenhum asset.
            </div>
            <div
              v-else
              class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              <div
                v-for="asset in assets"
                :key="asset.id"
                class="border border-border-subtle rounded overflow-hidden"
              >
                <div
                  class="h-32 bg-background-light flex items-center justify-center"
                >
                  <AssetImage
                    v-if="isImage(asset.mimeType)"
                    :file-key="asset.fileKey"
                    :mime-type="asset.mimeType"
                    :alt="asset.name"
                  />
                  <span
                    v-else
                    class="material-symbols-outlined text-4xl text-text-muted"
                    >description</span
                  >
                </div>
                <div class="p-3">
                  <p class="font-medium text-sm truncate">{{ asset.name }}</p>
                  <p class="text-xs text-text-muted">
                    {{ asset.assetType }} ·
                    {{ formatFileSize(asset.fileSizeBytes) }}
                  </p>
                  <div class="flex gap-2 mt-2">
                    <button
                      class="text-xs text-primary hover:underline"
                      @click="handleDownload(asset)"
                    >
                      Download
                    </button>
                    <button
                      class="text-xs text-error hover:underline"
                      @click="deleteAsset(asset.id)"
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>

    <div
      v-if="showPaletteModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      @click.self="showPaletteModal = false"
    >
      <div
        class="bg-surface rounded border border-border-subtle w-full max-w-md p-6"
      >
        <h3 class="font-bold mb-4">Nova paleta</h3>
        <form class="flex flex-col gap-4" @submit.prevent="savePalette">
          <FormField label="Nome" :error="paletteErrors.fieldError('name')">
            <input
              v-model="paletteForm.name"
              required
              placeholder="Nome da paleta"
              class="w-full h-10 px-3 border rounded text-sm"
              :class="
                paletteErrors.fieldError('name')
                  ? 'border-error'
                  : 'border-border-subtle'
              "
            />
          </FormField>
          <FormField
            label="Descrição"
            optional
            :error="paletteErrors.fieldError('description')"
          >
            <textarea
              v-model="paletteForm.description"
              placeholder="Descrição da paleta"
              rows="2"
              class="w-full px-3 py-2 border rounded text-sm"
              :class="
                paletteErrors.fieldError('description')
                  ? 'border-error'
                  : 'border-border-subtle'
              "
            />
          </FormField>
          <label class="flex items-center gap-2 text-sm">
            <input v-model="paletteForm.isPrimary" type="checkbox" />
            Marcar como paleta primária
          </label>
          <div class="flex justify-end gap-2">
            <button
              type="button"
              class="px-4 py-2 text-sm border rounded"
              :disabled="savingPalette"
              @click="showPaletteModal = false"
            >
              Cancelar
            </button>
            <AppButton type="submit" :loading="savingPalette">Salvar</AppButton>
          </div>
        </form>
      </div>
    </div>

    <!-- Color modal -->
    <div
      v-if="showColorModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      @click.self="showColorModal = false"
    >
      <div
        class="bg-surface rounded border border-border-subtle w-full max-w-md p-6"
      >
        <h3 class="font-bold mb-4">Nova cor</h3>
        <form class="flex flex-col gap-4" @submit.prevent="saveColor">
          <FormField label="Nome" :error="colorErrors.fieldError('name')">
            <input
              v-model="colorForm.name"
              required
              placeholder="Nome da cor"
              class="w-full h-10 px-3 border rounded text-sm"
              :class="
                colorErrors.fieldError('name')
                  ? 'border-error'
                  : 'border-border-subtle'
              "
            />
          </FormField>
          <FormField label="Hex" :error="colorErrors.fieldError('hexCode')">
            <div class="flex gap-3 items-center">
              <input
                v-model="colorForm.hexCode"
                type="color"
                class="w-12 h-10 border-0 cursor-pointer"
                @input="onHexChange"
              />
              <input
                v-model="colorForm.hexCode"
                required
                pattern="^#[0-9A-Fa-f]{6}$"
                class="flex-1 h-10 px-3 border rounded text-sm font-mono"
                :class="
                  colorErrors.fieldError('hexCode')
                    ? 'border-error'
                    : 'border-border-subtle'
                "
                @input="onHexChange"
              />
            </div>
          </FormField>
          <FormField
            label="RGB"
            optional
            :error="colorErrors.fieldError('rgbValue')"
          >
            <input
              v-model="colorForm.rgbValue"
              placeholder="rgb(187,63,149)"
              class="w-full h-10 px-3 border rounded text-sm font-mono"
              :class="
                colorErrors.fieldError('rgbValue')
                  ? 'border-error'
                  : 'border-border-subtle'
              "
            />
          </FormField>
          <FormField
            label="CMYK"
            optional
            :error="colorErrors.fieldError('cmykValue')"
          >
            <input
              v-model="colorForm.cmykValue"
              placeholder="cmyk(0,50,0,0)"
              class="w-full h-10 px-3 border rounded text-sm font-mono"
              :class="
                colorErrors.fieldError('cmykValue')
                  ? 'border-error'
                  : 'border-border-subtle'
              "
            />
          </FormField>
          <div class="flex justify-end gap-2">
            <button
              type="button"
              class="px-4 py-2 text-sm border rounded"
              :disabled="savingColor"
              @click="showColorModal = false"
            >
              Cancelar
            </button>
            <AppButton type="submit" :loading="savingColor">Salvar</AppButton>
          </div>
        </form>
      </div>
    </div>

    <!-- Typography modal -->
    <div
      v-if="showTypographyModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      @click.self="showTypographyModal = false"
    >
      <div
        class="bg-surface rounded border border-border-subtle w-full max-w-md p-6"
      >
        <h3 class="font-bold mb-4">
          {{ editingTypography ? "Editar tipografia" : "Nova tipografia" }}
        </h3>
        <form class="flex flex-col gap-4" @submit.prevent="saveTypography">
          <FormField label="Nome" :error="typographyErrors.fieldError('name')">
            <input
              v-model="typographyForm.name"
              required
              placeholder="Nome"
              class="w-full h-10 px-3 border border-border-subtle rounded text-sm"
            />
          </FormField>
          <FormField
            label="Família"
            :error="typographyErrors.fieldError('fontFamily')"
          >
            <input
              v-model="typographyForm.fontFamily"
              required
              placeholder="Família (ex: Inter)"
              class="w-full h-10 px-3 border border-border-subtle rounded text-sm"
            />
          </FormField>
          <FormField
            label="Provedor"
            :error="typographyErrors.fieldError('provider')"
          >
            <input
              v-model="typographyForm.provider"
              required
              placeholder="Provedor"
              class="w-full h-10 px-3 border border-border-subtle rounded text-sm"
            />
          </FormField>
          <FormField
            label="Categoria"
            optional
            :error="typographyErrors.fieldError('category')"
          >
            <input
              v-model="typographyForm.category"
              placeholder="Categoria"
              class="w-full h-10 px-3 border border-border-subtle rounded text-sm"
            />
          </FormField>
          <div class="grid grid-cols-2 gap-3">
            <FormField
              label="Peso mín."
              :error="typographyErrors.fieldError('weightMin')"
            >
              <input
                v-model.number="typographyForm.weightMin"
                type="number"
                min="100"
                max="900"
                class="w-full h-10 px-3 border border-border-subtle rounded text-sm"
              />
            </FormField>
            <FormField
              label="Peso máx."
              :error="typographyErrors.fieldError('weightMax')"
            >
              <input
                v-model.number="typographyForm.weightMax"
                type="number"
                min="100"
                max="900"
                class="w-full h-10 px-3 border border-border-subtle rounded text-sm"
              />
            </FormField>
          </div>
          <div class="flex justify-end gap-2">
            <button
              type="button"
              class="px-4 py-2 text-sm border rounded"
              :disabled="savingTypography"
              @click="showTypographyModal = false"
            >
              Cancelar
            </button>
            <AppButton type="submit" :loading="savingTypography"
              >Salvar</AppButton
            >
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
