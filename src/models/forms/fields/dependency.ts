
/**
 * The class that we use to represent a dependency between two fields. A child field depends on a parent field
 * if its visibility depends on the value of the parent field.
 */
export class Dependency<T> {

    id: string

    childId: string

    parentId: string

    parentValue: T    

    /**
     * The constructor.
     * 
     * @param id. The ID of the dependency instance.
     * @param childId. The ID of the child (dependent) form field.
     * @param parentId. The ID of the parent (depended on) form field.
     * @param parentValue. The value that the parent needs to have in order for the child to be visible.
     */
	constructor(id: string, childId: string, parentId: string, parentValue: T) {
        this.id = id
        this.childId = childId
        this.parentId = parentId
        this.parentValue = parentValue
	}

    /**
     * Checks whether the value of the parent field is equal to the value of other. We use this to change the visilibity of the child field.
     * @param other. The value that we're comparing the parent value to.
     * @returns. True if other is equal to the parent value, false otherwise.
     */
    equalsParentValue(other: T): boolean {
        return this.parentValue === other
    }
}