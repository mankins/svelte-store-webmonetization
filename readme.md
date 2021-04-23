# Svelte Store Web Monetization

A [Svelte store](https://svelte.dev/tutorial/writable-stores) for listening to changes to Web Monetization.

## Usage

```
npm install -D svelte-store-webmonetization
```

```javascript
  import webmon from 'svelte-store-webmonetization';
```

```svelte
    {#if $webmon.monetized}
        <h1>Premium Content Unlocked</h1>
    {/if}

    Web Monetization: {JSON.stringify($webmon)}
```

## Setup Web Monetization

This assumes that you have a payment pointer setup on your `app.html`:

```html
	<meta name="monetization" content="$ilp.uphold.com/fWWxqr4H9rHa" />
```

For more information see [Web Monetization](https://webmonetization.org).


## Related
- [svelte-monetization](https://github.com/wobsoriano/svelte-monetization)

## See Also
- [Web Monetization](https://webmonetization.org)
- [Web Monetization Browser Events](https://webmonetization.org/docs/api#browser-events)

## License

This plugin is released under the [MIT License](license.md).