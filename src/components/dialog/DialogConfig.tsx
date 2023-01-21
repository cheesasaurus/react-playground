
export interface DialogConfig {
    
    /**
     * Text to display in the dialog's top bar.
     */
    title?: string;

    /**
     * If true, no extra preparation of the content will be done. e.g. overflow handling, background, text styling...
     */
    useRawContent?: boolean;

    /**
     * Width of the dialog, in pixels
     */
    width?: number;

    /**
     * Height of the dialog, in pixels
     */
    height?: number;
    
}
