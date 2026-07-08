<script lang="ts">
    import { m } from "$lib/paraglide/messages.js";
</script>

<h1 class="text-2xl font-bold">{m.title_info()}</h1>

<p class="mt-4 text-gray-700 leading-relaxed">
    {m.info_description()}
</p>

<section class="mt-8">
    <h2 class="text-xl font-semibold text-gray-800">
        {m.info_goal()}
    </h2>
</section>

<section class="mt-8">
    <h2 class="text-xl font-semibold text-gray-800 mb-4">
        {m.info_step1_title()}
    </h2>
    <p class="text-gray-700 leading-relaxed">{m.info_step1()}</p>

    <h2 class="text-xl font-semibold text-gray-800 mt-6 mb-4">
        {m.info_step2_title()}
    </h2>
    <p class="text-gray-700 leading-relaxed">{m.info_step2()}</p>

    <h2 class="text-xl font-semibold text-gray-800 mt-6 mb-4">
        {m.info_step3_title()}
    </h2>
    <p class="text-gray-700 leading-relaxed">{m.info_step3()}</p>

    <h2 class="text-xl font-semibold text-gray-800 mt-6 mb-4">
        {m.info_step4_title()}
    </h2>
    <p class="text-gray-700 leading-relaxed">{m.info_step4()}</p>

    <h2 class="text-xl font-semibold text-gray-800 mt-6 mb-4">
        {m.info_step5_title()}
    </h2>
    <p class="text-gray-700 leading-relaxed">{m.info_step5()}</p>
</section>
