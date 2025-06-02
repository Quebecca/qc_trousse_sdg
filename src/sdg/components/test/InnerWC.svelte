<svelte:options customElement="{{
    tag: 'qc-inner',
    shadow: 'none',
    props: {
        value: {attribute:'inner-value'},
        label: {attribute:'inner-label'},
        name: {attribute:'inner-name'},
    },
    extend: (customElementConstructor) => {
            return class extends customElementConstructor {
                static inner;
                static outer;

				constructor() {
					super();
                    this.inner = this;
                    this.outer = this.closest('qc-outer')
				}
			};
		}
}}" />
<script>

    import Inner from "./Inner.svelte";
    import {onMount} from "svelte";
    let {inner, outer, value, label, name} = $props();
</script>

<Inner {value} {label} name={outer?.name ?? name}></Inner>