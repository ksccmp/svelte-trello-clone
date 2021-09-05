<script>
    import { tick, createEventDispatcher } from 'svelte';
    import { autoFocusout } from '~/actions/autoFocusout';
    import { lists } from '~/store/list';

    export let list;

    let isEditMode = false;
    let title = list.title;
    let textareaEl;
    const dispatch = createEventDispatcher();

    const saveTitle = () => {
        if (title.trim()) {
            lists.edit({
                listId: list.id,
                title,
            });
        }

        offEditMode();
    }

    const removeList = () => {
        lists.remove({
            listId: list.id,
        });

        offEditMode();
    }

    const onEditMode = async () => {
        isEditMode = true;
        title = list.title;
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
                  placeholder="Enter a title for this list..."
                  on:keydown={(e) => {
                      e.key === 'Enter' && saveTitle();
                      (e.key === 'Escape' || e.key === 'Esc') && offEditMode();
                  }}></textarea>
        <div class="actions">
            <div class="btn success"
                 on:click={saveTitle}>
                Save
            </div>
            <div class="btn"
                 on:click={offEditMode}>
                Cancel
            </div>
            <div class="btn danger"
                 on:click={removeList}>
                Delete List
            </div>
        </div>
    </div>
{:else}
    <h2 class="title">
        {list.title}
        <div class="btn small edit-btn-for-list"
             on:click={onEditMode}>
            Edit
        </div>
    </h2>
{/if}

<style lang="scss">
    h2.title {
        font-weight: 700;
        padding: 4px 8px;
        cursor: pointer;
        position: relative;

        .btn {
            position: absolute;
            top: 0;
            right: 0;
            display: none;
        }
    }

    :global(.list__inner:hover .edit-btn-for-list) {
        display: block !important;
    }
</style>