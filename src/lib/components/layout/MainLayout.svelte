<script lang="ts">
    import Header from "./Header.svelte";
    import Sidebar from "./Sidebar.svelte";

    let { children } = $props();

    let sidebarOpen = $state(false);

    function toggleSidebar() {
        sidebarOpen = !sidebarOpen;
    }

    function closeSidebar() {
        sidebarOpen = false;
    }
</script>

<div class="h-screen overflow-hidden flex flex-col">
    <Header ontogglesidebar={toggleSidebar} sidebaropen={sidebarOpen} />

    <div class="flex-1 flex overflow-hidden">
        {#if sidebarOpen}
            <!-- svelte-ignore a11y_click_events_have_key_events -->
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <div
                class="fixed inset-0 bg-black/50 z-30 md:hidden"
                onclick={closeSidebar}
            ></div>
        {/if}

        <div
            class="md:static md:flex md:shrink-0
                   fixed left-0 top-16 bottom-0 z-40
                   transition-transform duration-300 ease-in-out
                   {sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                   md:translate-x-0"
        >
            <Sidebar />
        </div>

        <main class="flex-1 overflow-y-auto p-8 bg-gray-50 dark:bg-gray-950">
            <div class="max-w-4xl mx-auto">
                {@render children()}
            </div>
        </main>
    </div>
</div>
