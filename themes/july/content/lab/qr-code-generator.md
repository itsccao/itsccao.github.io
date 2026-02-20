+++
title = "QR Code Generator"
description = "A QR Code Generator, without any tracking or ads."
date = "2025-10-18"
tags = [
    "javascript"
]
+++

<p> Library used: <a href="https://www.npmjs.com/package/qrcode-generator/v/2.0.4" target="_blank">qrcode-generator</a> </p>

<script src="https://cdnjs.cloudflare.com/ajax/libs/qrcode-generator/1.4.4/qrcode.min.js"> </script>

<h2> Your content: </h2>
<br/>
<textarea id="qr-code-input" placeholder="Text or full URL" autofocus></textarea>
<h2> Your QR Code: </h2>
<br/>
<div id="qr-code-output"> </div>
<br/>
<div id="qr-code-download-container">
    <button id="qr-code-download"> Download </button>
</div>

<style>
    #qr-code-input
    {
        width: 100%;
        max-width: 100%;
        height: max-content;
        min-height: 4rem;
        padding-top: 0.6rem;
        padding-bottom: 0.6rem;
        background-color: var(--off-background);
        border-radius: 0.25rem;
        border-color: var(--text);
        color: var(--text);
        font-size: 1.1rem;
        resize: none;
    }

    #qr-code-input::placeholder
    {
        padding-left: 0.5rem;
        color: var(--text);
    }
    #qr-code-output
    {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        max-width: 100%;
    }

    #qr-code-output canvas
    {
        max-width: 75%;
        height: auto;
    }

    #qr-code-download-container
    {
        display: flex;
        align-items: center;
        justify-content: center;
    }

    #qr-code-download
    {
        width: 5rem;
        padding-top: 0.6rem;
        padding-bottom: 0.6rem;
        display: inline-block;
        background-color: var(--link);
        border-style: none;
        border-radius: 0.25rem;
        color: var(--background);
        display: none;
    }

    #qr-code-download:hover
    {
        cursor: pointer;
    }
</style>

<script src="/js/qr-code-generator.js"> </script>