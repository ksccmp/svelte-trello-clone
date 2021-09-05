<script>
    import { tick, createEventDispatcher } from "svelte";
    import { autoFocusout } from '~/actions/autoFocusout';
    import { cards } from '~/store/list';

    export let listId;
    export let card;

    let isEditMode = false;
    let title;
    let textareaEl;
    const dispatch = createEventDispatcher();

    const saveCard = () => {
        if(title.trim()) {
            cards.edit({
                listId,
                cardId: card.id,
                title,
            });

            offEditMode();
        }
    }

    const removeCard = () => {
        cards.remove({
            listId,
            cardId: card.id,
        });

        offEditMode();
    }

    const onEditMode = async () => {
        isEditMode = true;
        title = card.title;
        dispatch('editMode', true);
        await tick();

        textareaEl && textareaEl.focus();
    }

    const offEditMode = () => {
        isEditMode = false;
        dispatch('editMode', false);
    }
</script>

<div class="card">
    {#if isEditMode}
        <div use:autoFocusout={offEditMode}
             class="edit-mode">
            <textarea bind:value={title}
                      bind:this={textareaEl}
                      placeholder="Enter a title for this card..."
                      on:keydown={e => {
                          e.key === 'Enter' && saveCard();
                          (e.key === 'Escape' || e.key === 'Esc') && offEditMode();
                      }}></textarea>
            <div class="actions">
                <div class="btn success"
                     on:click={saveCard}>
                    Save
                </div>
                <div class="btn"
                     on:click={offEditMode}>
                    Cancle
                </div>
                <div class="btn danger"
                     on:click={removeCard}>
                    Delete Card
                </div>
            </div>
        </div>
    {:else}
        <div class="title">
            {card.title}
            <div class="btn small"
                 on:click={onEditMode}>
                Edit
            </div>
        </div>
    {/if}
</div>

<style lang="scss">
    .card {
        margin-bottom: 8px;

        &:last-child {
            margin-bottom: 1px;
        }

        :global(&.sortable-ghost) {
            position: relative;
            opacity: .1;

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

        .title {
            background-color: #fff;
            padding: 6px 8px;
            border-radius: 4px;
            box-shadow: 0 1px 0 rgba(9, 30, 66, 0.25);
            line-height: 20px;
            position: relative;

            &:hover {
                background-color: #f5f5f5;
            }

            &:hover .btn {
                display: block;
            }

            .btn {
                position: absolute;
                top: 6px;
                right: 8px;
                display: none;
            }
        }
    }
</style>