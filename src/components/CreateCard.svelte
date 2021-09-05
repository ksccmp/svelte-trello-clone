<script>
    import { createEventDispatcher, tick } from 'svelte';
    import { autoFocusout } from '~/actions/autoFocusout';
    import { cards } from '~/store/list';

    export let listId;

    let isEditMode = false;
    let title = '';
    let textareaEl;
    const dispatch = createEventDispatcher();

    const addCard = () => {
        if(title.trim()) {
            cards.add({
                listId,
                title,
            });

            offEditMode();
        }
    }

    const onEditMode = async () => {
        isEditMode = true;
        title = '';
        dispatch('editMode', true);
        await tick();

        textareaEl && textareaEl.focus();
    }

    const offEditMode = () => {
        isEditMode = false;
        dispatch('editMode', false);
    }
</script>

{#if isEditMode}
    <div use:autoFocusout={offEditMode}
         class="edit-mode">
        <textarea bind:value={title}
                  bind:this={textareaEl}
                  placeholder="Enter a title for this card..."
                  on:keydown={e => {
                      e.key === 'Enter' && addCard();
                      (e.key === 'Escape' || e.key === 'Esc') && offEditMode();
                  }}></textarea>
        <div class="actions">
            <div class="btn success"
                 on:click={addCard}>                
                 Add Card
            </div>
            <div class="btn"
                 on:click={offEditMode}>
                 Cancel
            </div>
        </div>
    </div>
{:else}
    <div class="add-another-card"
         on:click={onEditMode}>
         + Add another card
    </div>    
{/if}

<style lang="scss">
    .add-another-card {
        padding: 4px 8px;
        font-size: 14px;
        color: #5e6c84;
        cursor: pointer;
        border-radius: 4px;

        &:hover {
            background-color: rgba(9, 30, 66, .08);
            color: #172b4d;
        }
    }
</style>