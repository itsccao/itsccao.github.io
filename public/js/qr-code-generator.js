class qrCode
{
    constructor()
    {
        this.qrCurrent = null;
        this.qrSize = 1080;
        this.qrFormat = "png";

        this.qrInput = document.getElementById("qr-code-input");
        this.qrOutput = document.getElementById("qr-code-output");
        this.qrDownload = document.getElementById("qr-code-download");

        this.whereTheMagicBegins();
        this.qrErrorText = "<text> Please enter content to generate a QR code. </text>";
    }

    async whereTheMagicBegins()
    {
        if (!this.qrInput)
        {
            console.error("QR code content not found.");
            return;
        }

        this.qrInput.addEventListener("input", () =>
        {
            this.qrGenerator();
        });

        this.qrDownload.addEventListener("click", () =>
        {
            this.qrDownloadFunction();
        });

        this.qrGenerator();
    }

    qrGenerator()
    {
        const qrData = this.qrInput.value;

        if (qrData.length === 0)
        {
            this.qrOutput.innerHTML = "<text> Please enter content to generate a QR code. </text>";
            this.qrDownload.style.display = "none";
            this.qrCurrent = null;
            return;
        }

        try
        {
            const qr = qrcode(0, "M");
            qr.addData(qrData);
            qr.make();

            this.qrCurrent = qr;
            this.qrRenderCanvas(qr);
        }
        catch (error)
        {
            console.error("Error while generating QR code: ", error);
            this.qrOutput.innerHTML = this.qrErrorText;
            this.qrCurrent = null;
            return;
        }
    }

    qrRenderCanvas(qr)
    {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const moduleCount = qr.getModuleCount();

        const finalSize = this.qrSize;
        const padding = 40;

        canvas.width = finalSize;
        canvas.height = finalSize;

        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, finalSize, finalSize);

        const qrInnerSize = finalSize - (padding * 2);
        const cellSize = qrInnerSize / moduleCount;

        ctx.fillStyle = "#000000";
        for (let row = 0;row < moduleCount;row++)
        {
            for (let col = 0;col < moduleCount;col++)
            {
                if (qr.isDark(row, col))
                {
                    const x = Math.round(padding + (col * cellSize));
                    const y = Math.round(padding + (row * cellSize));
                    const w = Math.ceil(cellSize);
                    const h = Math.ceil(cellSize);
                    
                    ctx.fillRect(x, y, w, h);
                }
            }
        }
        this.qrOutput.innerHTML = "";
        this.qrOutput.appendChild(canvas);
        this.qrDownload.style.display = "block";
        window.scrollTo(0, document.body.scrollHeight);
    }

    qrDownloadFunction()
    {
        const canvas = this.qrOutput.querySelector("canvas");
        if (!canvas)
        {
            console.error("No QR code available for download.");
            return;
        }

        const link = document.createElement("a");
        link.href = canvas.toDataURL(`image/${this.qrFormat}`);
        link.download = `qr-code.${this.qrFormat}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}


document.addEventListener("DOMContentLoaded", () => {
    new qrCode();
});