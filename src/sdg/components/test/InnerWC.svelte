<svelte:options customElement="{{
    tag: 'qc-inner',
    shadow: 'none',
    props: {
        foo: {attribute:'foo'}
    },
    extend: (customElementConstructor) => {
            return class extends customElementConstructor {
                static inner;
                static outer;
				constructor() {
					super();
                    // console.log('typeof this',typeof this)
                    // console.log(this.getAttribute('bar'));
                    this.inner = this;
				}
			};
		}
}}" />
<script>

    import Inner from "./Inner.svelte";
    import {onMount} from "svelte";
    let {inner, outer, foo} = $props();
    let shared = $state('');
    onMount(() => {
         let outer = inner.closest('qc-outer')
         shared = outer.shared;
         console.log("inner/outer/shared",inner, outer, outer.shared ); //,outer.getShared()
    })
    // $inspect("outerShared in innerWC", outerShared)
    // $inspect(inner.root.shared)
</script>
<Inner {foo} {shared}></Inner>