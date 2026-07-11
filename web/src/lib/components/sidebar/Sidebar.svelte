<script lang="ts">
  import { clickOutside } from '$lib/actions/click-outside';
  import { focusTrap } from '$lib/actions/focus-trap';
  import { resizable } from '$lib/actions/resizable';
  import { menuButtonId } from '$lib/components/shared-components/navigation-bar/NavigationBar.svelte';
  import { mediaQueryManager } from '$lib/stores/media-query-manager.svelte';
  import { sidebarWidth } from '$lib/stores/preferences.store';
  import { sidebarStore } from '$lib/stores/sidebar.svelte';
  import { onMount, type Snippet } from 'svelte';
  import { t } from 'svelte-i18n';

  const MIN_SIDEBAR_WIDTH = 200;
  const MAX_SIDEBAR_WIDTH = 500;

  interface Props {
    ariaLabel?: string;
    children?: Snippet;
  }

  let { ariaLabel, children }: Props = $props();

  const isHidden = $derived(!sidebarStore.isOpen && !mediaQueryManager.isFullSidebar);
  const isExpanded = $derived(sidebarStore.isOpen && !mediaQueryManager.isFullSidebar);
  const isResizable = $derived(mediaQueryManager.isFullSidebar);

  onMount(() => {
    closeSidebar();
  });

  const closeSidebar = () => {
    if (!isExpanded) {
      return;
    }
    sidebarStore.reset();
    if (isHidden) {
      document.querySelector<HTMLButtonElement>(`#${menuButtonId}`)?.focus();
    }
  };
</script>

<nav
  id="sidebar"
  aria-label={ariaLabel}
  tabindex="-1"
  class="relative z-1 w-0 immich-scrollbar overflow-x-hidden overflow-y-auto bg-light pt-8 transition-all duration-200 sidebar:w-64"
  class:shadow-2xl={isExpanded}
  class:dark:border-e-immich-dark-gray={isExpanded}
  class:border-r={isExpanded}
  class:w-[min(100vw,16rem)]={sidebarStore.isOpen}
  style:width={isResizable ? `${$sidebarWidth}px` : undefined}
  style:transition={isResizable ? 'none' : undefined}
  data-testid="sidebar-parent"
  inert={isHidden}
  use:clickOutside={{ onOutclick: closeSidebar, onEscape: closeSidebar }}
  use:focusTrap={{ active: isExpanded }}
>
  <div class="flex h-max min-h-full flex-col gap-1 pe-6">
    {@render children?.()}
  </div>

  {#if isResizable}
    <div
      role="separator"
      aria-orientation="vertical"
      aria-label={$t('resize_sidebar')}
      class="absolute inset-y-0 end-0 z-10 w-1 touch-none cursor-col-resize hover:bg-primary/50 active:bg-primary"
      use:resizable={{
        width: $sidebarWidth,
        minWidth: MIN_SIDEBAR_WIDTH,
        maxWidth: MAX_SIDEBAR_WIDTH,
        onResize: (width) => ($sidebarWidth = width),
      }}
    ></div>
  {/if}
</nav>
