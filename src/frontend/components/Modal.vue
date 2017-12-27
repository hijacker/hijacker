<template>
  <div class="modal" :class="{ 'modal-open': this.open }">
    <div class="modal-inner">
      <div class="modal-content">
        <div class="modal-close-icon">
          <a class="close-modal" @click="$emit('closeBtn')">[icon]</a>
        </div>
        <div class="modal-content-inner">
          <slot></slot>
        </div>
        <hr class="modal-buttons-seperator">
        <div class="modal-buttons">
          <button class="button close-modal" @click="$emit('closeBtn')">Cancel</button>
          <button class="button button-primary close-modal" @click="$emit('success')">OK</button>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
export default {
  name: 'Modal',
  props: {
    open: {
      type: Boolean,
      default: function() {
        return false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.modal {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0,0,0,0.65);
	visibility: hidden;
	backface-visibility: hidden;
  opacity: 0;
  transition: opacity .15s ease-in-out;

  &.modal-open {
    visibility: visible;
  	backface-visibility: visible;
    opacity: 1;
    z-index: 1;
  }

  .modal-inner {
    position: relative;
    height: 100%;
    display:flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .modal-content {
      background-color: white;
      max-width: 40em;
      width: 90%;
      padding: 1em 1.5em;
      position: relative;
      margin: 2em;
      box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.35);

      .modal-close-icon {
        position: absolute;
        right: 1.5em;
      }

      .modal-content-inner {
        h1, h2, h3, h4, h5, h6 {
          margin-bottom: 0.25em;
        }

        p {
          margin-bottom: 1em;
        }
      }

      .modal-buttons-seperator {
        margin: 1.5em 0;
        margin-top: 0;
      }

      .modal-buttons {
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        align-items: center;

        button {
          margin-left: 1em;

          &:first-child {
            margin-left: 0;
          }
        }
      }
    }
  }
}
</style>
