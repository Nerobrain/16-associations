<script lang="ts">
    import { resolve } from "$app/paths";
    import { m } from "$lib/paraglide/messages.js";
    import StyledMessage from "../ui/StyledMessage.svelte";
</script>

<h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">{m.app_title().toLowerCase()}</h1>

<section class="mt-8 space-y-8 text-gray-700 dark:text-gray-300 leading-relaxed">
    <div>
        <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">{m.title_info()}</h2>
        <p class="text-gray-500 dark:text-gray-400">
            <StyledMessage
                class="text-gray-500 dark:text-gray-400"
                message={m.info_what_is_text}
                inputs={{ appTitle: m.app_title().toLowerCase() }}
            />
        </p>
        <p class="mt-2 text-gray-500 dark:text-gray-400">{m.info_what_is_insight()}</p>
    </div>
    <div>
        <h3 class="font-semibold text-gray-800 dark:text-gray-200 mb-3">{m.info_goal_title()}</h3>
        <ul class="mt-2 list-disc list-inside space-y-1 text-gray-500 dark:text-gray-400">
            <li>{m.info_goal_item1()}</li>
            <li>{m.info_goal_item2()}</li>
            <li>{m.info_goal_item3()}</li>
        </ul>
    </div>

    <div class="pt-4 border-t border-gray-200 dark:border-gray-700 space-x-4">
        <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">{m.info_how_title()}</h2>
        <p class="mb-4 text-gray-500 dark:text-gray-400">{m.info_how_intro()}</p>

        <div class="space-y-6">
            <div>
                <h3 class="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">{m.info_step1_title()}</h3>
                <p class="mb-4 text-gray-500 dark:text-gray-400"><StyledMessage message={m.info_step1_text} /></p>
            </div>

            <div>
                <h3 class="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">{m.info_step2_title()}</h3>
                <p class="mb-4 text-gray-500 dark:text-gray-400">{m.info_step2_text()}</p>
            </div>

            <div>
                <h3 class="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">{m.info_step3_title()}</h3>
                <p class="mb-4 text-gray-500 dark:text-gray-400"><StyledMessage message={m.info_step3_text} /></p>
                <p class="mb-4 text-gray-500 dark:text-gray-400"><StyledMessage message={m.info_step3_path} /></p>
            </div>

            <div>
                <h3 class="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">{m.info_step4_title()}</h3>
                <p class="mb-4 text-gray-500 dark:text-gray-400">{m.info_step4_text()}</p>
                <p class=" text-gray-500 dark:text-gray-400">{m.info_step4_prompt()}</p>
                <ul class="list-disc list-inside mt-1 space-y-1 text-gray-500 dark:text-gray-400">
                    <li>{m.result_q1()}</li>
                    <li>{m.result_q2()}</li>
                    <li>{m.result_q3()}</li>
                </ul>
                <p class="mb-4 text-gray-500 dark:text-gray-400">
                    {m.info_tree_hint_prefix()}
                    <strong>«{m.result_show_tree()}»</strong>.
                </p>
            </div>
        </div>
    </div>

    <div class="pt-4 border-t border-gray-200 dark:border-gray-700 space-x-4">
        <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">{m.info_whattodo_title()}</h2>
        <p class="mb-4 text-gray-500 dark:text-gray-400"><StyledMessage message={m.info_whattodo_text} /></p>
    </div>

    <div class="pt-4 border-t border-gray-200 dark:border-gray-700 space-x-4">
        <a
            href={resolve("/session/new")}
            class="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 underline"
            >{m.info_start_session()}</a
        >
        <a
            href={resolve("/history")}
            class="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 underline"
            >{m.info_view_history()}</a
        >
    </div>
</section>
