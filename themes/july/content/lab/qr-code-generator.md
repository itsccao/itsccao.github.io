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
        min-height: 4rem;
        padding: 0.8rem;
        background-color: var(--off-background);
        border: 2px solid var(--box-shadow-hover);
        border-radius: 0.5rem;
        color: var(--text);
        font-size: 1.1rem;
        resize: vertical;
        transition: border-color 0.2s ease;
    }

    #qr-code-input:focus
    {
        outline: none;
        border-color: var(--link-hover);
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
        padding: 0.75rem 1.5rem;
        background-color: var(--off-background);
        border: 2px solid var(--box-shadow-hover);
        border-radius: 0.5rem;
        color: var(--text);
        font-size: 1rem;
        font-weight: 600;
        transition: all 0.2s ease;
        display: none;
    }

    #qr-code-download:hover
    {
        cursor: pointer;
        border-color: var(--link-hover);
        color: var(--link-hover);
        transform: translateY(-2px);
    }
</style>

<script src="/js/qr-code-generator.js"> </script>