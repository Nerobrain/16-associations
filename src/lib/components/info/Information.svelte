<script lang="ts">
    import { resolve } from "$app/paths";
    import { m } from "$lib/paraglide/messages.js";
    import StyledMessage from "../ui/StyledMessage.svelte";
</script>

<h1 class="text-2xl font-bold">{m.app_title().toLowerCase()}</h1>

<section class="mt-8 space-y-8 text-gray-700 leading-relaxed">
    <div>
        <h2 class="text-xl font-semibold text-gray-800 mb-3">{m.title_info()}</h2>
        <p>
            <StyledMessage message={m.info_what_is_text} inputs={{ appTitle: m.app_title().toLowerCase() }} />
        </p>
        <p class="mt-2">{m.info_what_is_insight()}</p>
    </div>
    <div>
        <h3 class="font-semibold text-gray-800 mb-3">{m.info_goal_title()}</h3>
        <ul class="mt-2 list-disc list-inside space-y-1">
            <li>{m.info_goal_item1()}</li>
            <li>{m.info_goal_item2()}</li>
            <li>{m.info_goal_item3()}</li>
        </ul>
    </div>

    <div class="pt-4 border-t border-gray-200 space-x-4">
        <h2 class="text-xl font-semibold text-gray-800 mb-3">{m.info_how_title()}</h2>
        <p class="mb-4">{m.info_how_intro()}</p>

        <div class="space-y-6">
            <div>
                <h3 class="text-lg font-medium text-gray-800 mb-2">{m.info_step1_title()}</h3>
                <p><StyledMessage message={m.info_step1_text} /></p>
            </div>

            <div>
                <h3 class="text-lg font-medium text-gray-800 mb-2">{m.info_step2_title()}</h3>
                <p>{m.info_step2_text()}</p>
            </div>

            <div>
                <h3 class="text-lg font-medium text-gray-800 mb-2">{m.info_step3_title()}</h3>
                <p><StyledMessage message={m.info_step3_text} /></p>
                <p class="mt-1"><StyledMessage message={m.info_step3_path} /></p>
            </div>

            <div>
                <h3 class="text-lg font-medium text-gray-800 mb-2">{m.info_step4_title()}</h3>
                <p>{m.info_step4_text()}</p>
                <p class="mt-1">{m.info_step4_prompt()}</p>
                <ul class="list-disc list-inside mt-1 space-y-1">
                    <li>{m.result_q1()}</li>
                    <li>{m.result_q2()}</li>
                    <li>{m.result_q3()}</li>
                </ul>
                <p class="mt-1">
                    {m.info_tree_hint_prefix()}
                    <strong>«{m.result_show_tree()}»</strong>.
                </p>
            </div>
        </div>
    </div>

    <div class="pt-4 border-t border-gray-200 space-x-4">
        <h2 class="text-xl font-semibold text-gray-800 mb-3">{m.info_whattodo_title()}</h2>
        <p><StyledMessage message={m.info_whattodo_text} /></p>
    </div>

    <div class="pt-4 border-t border-gray-200 space-x-4">
        <a href={resolve("/session/new")} class="text-blue-600 hover:text-blue-800 underline"
            >{m.info_start_session()}</a
        >
        <a href={resolve("/history")} class="text-blue-600 hover:text-blue-800 underline">{m.info_view_history()}</a>
    </div>
</section>
