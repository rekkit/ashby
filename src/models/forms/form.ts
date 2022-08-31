import { Section } from "./section";

/**
 * The class that represents a form.
 */
export class Form {

    sections: Section[] = []

    /**
     * Creates a new section to the form.
     * 
     * @param section. The section to be added to the form.
     */
    public addSection(section: Section): void {
        this.sections.push(section)
    }

    /**
     * Inserts a section into the form at the given index.
     * 
     * @param section. The section that we want to add to the form.
     * @param idx. The index where we want to insert the section.
     */
    public addSectionAtIndex(section: Section, idx: number) {
        this.sections.splice(idx, 0, section)
    }
}
