<script>
    import List from '~/components/List.svelte';
    import CreateList from '~/components/CreateList.svelte';
    import { lists } from '~/store/list';
    import { onMount } from 'svelte';
    import Sortable from 'sortablejs';

    let listsEl;
    let sortableLists;

    onMount(() => {
        sortableLists = new Sortable(listsEl, {
            group: 'My Lists',
            handle: '.list',
            delay: 50,
            animaiton: 0,
            forceFallback: true,
            onEnd(e) {
                lists.reorder({
                    oldIndex: e.oldIndex,
                    newIndex: e.newIndex
                })
            }
        })
    });
</script>

<div class="list-container">
    <div class="lists"
         bind:this={listsEl}>
        {#each $lists as list (list.id)}
            <List {list} {sortableLists} />
        {/each}
    </div>
    <CreateList />
</div>

<style lang="scss">
    .list-container {
        width: 100vw;
        height: calc(100vh - 40px);
        padding: 30px;
        box-sizing: border-box;
        overflow-x: auto;
        overflow-y: hidden;
        white-space: nowrap;
        font-size: 0;

        .lists {
            display: inline-block;
            height: 100%;
            white-space: nowrap;
            font-size: 0;
        }
    }
</style>