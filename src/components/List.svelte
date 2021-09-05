<script>
    import CreateCard from '~/components/CreateCard.svelte';
    import ListTitle from '~/components/ListTitle.svelte';
    import Card from '~/components/Card.svelte';
    import Sortable from 'sortablejs';
    import { onMount } from 'svelte';
    import { cards } from '~/store/list';

    export let list;
    export let sortableLists;

    let sortableCards;
    let cardsEl;

    const disableSortable = (e) => {
        sortableLists.option('disabled', e.detail);
        sortableCards.option('disabled', e.detail);
    }

    onMount(() => {
        sortableCards = new Sortable(cardsEl, {
            group: 'My Cards',
            handle: '.card',
            delay: 50,
            animaiton: 0,
            forceFallback: true,
            onEnd(e) {
                cards.reorder({
                    fromListId: e.from.dataset.listId,
                    toListId: e.to.dataset.listId,
                    oldIndex: e.oldIndex,
                    newIndex: e.newIndex
                })
            }
        })
    });
</script>

<div class="list">
    <div class="list__inner">
        <div class="list__heading">
            <ListTitle {list} on:editMode={disableSortable} />
            <p>
                {list.cards.length} cards
            </p>
        </div>
        <div class="list__cards"
             bind:this={cardsEl}
             data-list-id={list.id}>
            {#each list.cards as card (card.id)}
                <Card listId={list.id} {card} on:editMode={disableSortable}/>
            {/each}
        </div>
        <CreateCard listId={list.id} on:editMode={disableSortable} />
    </div>
</div>

<style lang="scss">
    .list {
        display: inline-block;
        width: 290px;
        height: 100%;
        box-sizing: border-box;
        font-size: 16px;
        margin: 0 4px;
        line-height: 20px;
        word-break: break-all;
        white-space: normal;

        :global(&.sortable-ghost) {
            position: relative;
            opacity: .2;

            &::after {
                content: "";
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: #000;
                border-radius: 4px;
            }
        }

        :global(&.sortable-chosen) {
            cursor: move;
        }

        .list__inner {
            display: flex;
            flex-direction: column;
            max-height: 100%;
            padding: 10px 8px;
            box-sizing: border-box;
            background-color: #ebecf0;
            border-radius: 4px;

            .list__heading {
                margin-bottom: 10px;

                p {
                    color: #5e6c84;
                    padding: 0 8px;
                }
            }

            .list__cards {
                overflow-x: hidden;
                overflow-y: auto;
                margin-bottom: 10px;
            }
        }
    }
</style>