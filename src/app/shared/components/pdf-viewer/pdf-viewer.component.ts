import { Component, ElementRef, ViewChild, Input } from '@angular/core';
import { NavController } from 'ionic-angular';
import * as PDFJS from 'pdfjs-dist/webpack.js';
import { PDFPageProxy, PDFPageViewport, PDFRenderTask } from 'pdfjs-dist';

@Component({
    selector: 'pdf-viewer-edospnc',
    templateUrl: 'pdf-viewer.component.html'
})
export class PdfViewerComponent {
    pdfDocument: PDFJS.PDFDocumentProxy;
    PDFJSViewer = PDFJS;
    pageContainerUnique = {
        width: 0,
        height: 0,
        element: null as HTMLElement,
        canvas: null as HTMLCanvasElement,
        textContainer: null as HTMLElement,
        canvasWrapper: null as HTMLElement
    }
    @ViewChild('pageContainer') pageContainerRef: ElementRef;
    @ViewChild('viewer') viewerRef: ElementRef;
    @ViewChild('canvas') canvasRef: ElementRef;
    @ViewChild('canvasWrapper') canvasWrapperRef: ElementRef;
    @ViewChild('textContainer') textContainerRef: ElementRef;

    currentPageNumber = 1;
    nbPages: number;
    isRenderProcessing = false;

    constructor(public navCtrl: NavController) {
    }
    @Input()
    set base64(base64: string) {
        this.pageContainerUnique.element = this.pageContainerRef.nativeElement as HTMLElement;
        this.pageContainerUnique.canvasWrapper = this.canvasWrapperRef.nativeElement as HTMLCanvasElement;
        this.pageContainerUnique.canvas = this.canvasRef.nativeElement as HTMLCanvasElement;
        this.pageContainerUnique.textContainer = this.textContainerRef.nativeElement as HTMLCanvasElement;
        const raw = window.atob(base64);
        const rawLength = raw.length;
        var array = new Uint8Array(new ArrayBuffer(rawLength));
        for (let i = 0; i < rawLength; i++) {
            array[i] = raw.charCodeAt(i);
        }
        const pdfAsArray = array;
        this.PDFJSViewer.getDocument(pdfAsArray)
        .then(pdf => {
            this.pdfDocument = pdf;
            this.nbPages = this.pdfDocument.numPages;
            return this.loadPage(this.currentPageNumber);
        }).then((pdfPage) => {
        }).catch(e => {
            console.error(e);
            return false;
        });
    }
    ionViewDidLoad() {
        this.pageContainerUnique.element = this.pageContainerRef.nativeElement as HTMLElement;
        this.pageContainerUnique.canvasWrapper = this.canvasWrapperRef.nativeElement as HTMLCanvasElement;
        this.pageContainerUnique.canvas = this.canvasRef.nativeElement as HTMLCanvasElement;
        this.pageContainerUnique.textContainer = this.textContainerRef.nativeElement as HTMLCanvasElement;
    }

    loadPage(pageNum: number = 1): Promise<number> {
            let pdfPage: PDFPageProxy;
            return this.pdfDocument.getPage(pageNum).then(thisPage => {
                pdfPage = thisPage;
                const pageHasBeenRendered = this.renderOnePage(pdfPage);
                return pageNum;
            }).then(() => {
                return pageNum;
            });
    }

    goToPage(pageNumberToDisplay: number) {
        if (!this.isRenderProcessing) {
            this.loadPage(pageNumberToDisplay).then(pageDisplayedNumber => {
                this.currentPageNumber = pageDisplayedNumber;
            });
        }
    }
    openPreviousPage() {
        if (!this.isFirstPage() ) {
            const pageToDisplay = this.currentPageNumber - 1;
            this.goToPage(pageToDisplay);
        } else {
            this.goToPage(1);
        }
    }

    openNextPage() {
        if (!this.isLastPage()) {
            const pageToDisplay = this.currentPageNumber + 1;
            this.goToPage(pageToDisplay);
        } else {
            this.goToPage(this.nbPages);
        }
    }

    isLastPage(): boolean {
        return this.currentPageNumber >= this.nbPages;
    }

    isFirstPage(): boolean {
        return this.currentPageNumber === 1;
    }

    async renderOnePage(pdfPage: PDFPageProxy) {
        this.isRenderProcessing = true;
        let textContainer: HTMLElement;
        let canvas: HTMLCanvasElement;
        let wrapper: HTMLElement;

        let canvasContext: CanvasRenderingContext2D;
        let page: HTMLElement

        page = this.pageContainerUnique.element;
        textContainer = this.pageContainerUnique.textContainer;
        canvas = this.pageContainerUnique.canvas;
        wrapper = this.pageContainerUnique.canvasWrapper;

        canvasContext = canvas.getContext('2d') as CanvasRenderingContext2D;
        canvasContext.imageSmoothingEnabled = false;
        /*canvasContext.webkitImageSmoothingEnabled = false;
        canvasContext.mozImageSmoothingEnabled = false;
        canvasContext.oImageSmoothingEnabled = false;*/

        const viewport = pdfPage.getViewport(1) as PDFPageViewport;

        canvas.width = viewport.width;
        canvas.height = viewport.height;
        page.style.width = `${viewport.width}px`;
        page.style.height = `${viewport.height}px`;
        wrapper.style.width = `${viewport.width}px`;
        wrapper.style.height = `${viewport.height}px`;
        textContainer.style.width = `${viewport.width}px`;
        textContainer.style.height = `${viewport.height}px`;

        if (window.devicePixelRatio > 1) {
            const canvasWidth = canvas.width;
            const canvasHeight = canvas.height;
            canvas.width = canvasWidth * window.devicePixelRatio;
            canvas.height = canvasHeight * window.devicePixelRatio;
            canvas.style.width = canvasWidth + 'px';
            canvas.style.height = canvasHeight + 'px';
            canvasContext.scale(window.devicePixelRatio, window.devicePixelRatio);
        }

        // THIS RENDERS THE PAGE !!!!!!
        const renderTask: PDFRenderTask = pdfPage.render({
            canvasContext,
            viewport
        });

        const container = textContainer;

        return renderTask.then(() => {
            return pdfPage.getTextContent();
        }).then((textContent) => {
            let textLayer: HTMLElement;
            textLayer = this.pageContainerUnique.textContainer
            while (textLayer.lastChild) {
                textLayer.removeChild(textLayer.lastChild);
            }
            this.PDFJSViewer.renderTextLayer({
                textContent,
                container,
                viewport,
                textDivs: []
            });
            this.isRenderProcessing = false;
            return true;
        });
    }
}