import { Field } from "./fields/abstract/field";
import { Dependency } from "./fields/dependency";

/**
 * The class that represents a form.
 */
export class Form {

    // The ID of the form. If this is a form template, then this is the template ID. If this is a submission, this is the submission ID.
    id: string

    // This is where we keep all of the form fields.
    fields: Map<string, Field<any>> = new Map()

    // These are the child fields, i.e. fields whose visibility (visible / hidden) depends on another field.
    children: Map<string, Dependency<any>> = new Map()

    // This is where we track the children of each field (if any).
    // This is so that we know exactly which fields to show / hide when we change a field that has children,
    // instead of iterating through all fields.
    parents: Map<string, string[]> = new Map()

    /**
     * 
     * @param id. The ID of the form. If this is a form template, then this is the template ID. If this is a submission, this is the submission ID.
     */
    constructor(id: string) {
        this.id = id
    }

    /**
     * Checks whether all the fields in the form are valid. If they are, we consider the form to be valid.
     */
    public isValid(): boolean {
        for (const [id, field] of this.fields) {
            if (!field.isValid()) return false
        }

        return true
    }

    /**
     * Creates a form field. This will throw an exception if the field already exists.
     * 
     * @param field. The new field value that we want to add.
     */
    public createField(field: Field<any>): void {

        if (this.fields.has(field.id)) {
            throw new Error("Field already exists!")
        }

        this.fields.set(field.id, field)
    }

    /**
     * Updates a form field.
     * 
     * @param field. The new value of the field that we want to update. This will throw an error if the field
     * doesn't already exist.
     */
    public updateField(field: Field<any>): void {

        let oldField: Field<any> | undefined = this.fields.get(field.id)

        if (oldField == undefined) {
            throw new Error("Couldn't find the field that needs to be updated!")
        }

        // Make sure that the field hasn't changed type.
        if (oldField.fieldType != field.fieldType) {
            throw new Error("You are not allowed to change the field type of a field. Please create a new field if you want to change the type.")
        }

        // Check if the field is a parent field. If it is, we might have to update its children.
        let affectedChildrenIds: string[] | undefined = this.parents.get(field.id)

        if (affectedChildrenIds != undefined) {
            for (let i = 0; i < affectedChildrenIds.length; i++) {
                this._updateChildVisibility(affectedChildrenIds[i])
            }
        }

        this.fields.set(field.id, field)

        // Finally, update the field's visibility. If this is a parent field or it doesn't have dependencies, nothing happens.
        // If it does have dependencies, we update the visibility.
        this._updateChildVisibility(field.id)
    }

    /**
     * Creates a form field if it doesn't already exist. Otherwise it updates the existing field.
     * Used for handling PUT requests, which are create / update operations.
     * 
     * @param field. The field that we want to create or update.
     */
    public createOrUpdateField(field: Field<any>): void {

        if (!this.fields.has(field.id)) {
            this.createField(field)
        }
        else {
            this.updateField(field)
        }
    }

    /**
     * Delete a form field. This will not throw an exception if the field does not exist because
     * the end result is the same.
     * 
     * @param fieldId. The ID of the field that we want to delete.
     */
    public deleteField(fieldId: string) {
        this.fields.delete(fieldId)

        let deps: Dependency<any>[] = this.getDependencies(fieldId)

        for (let i = 0; i < deps.length; i++) {
            this.deleteDependency(deps[i])
        }
    }

    /**
     * Creates a dependency between two fields.
     * 
     * @param parentFieldId. The ID of the parent field. If this field has a certain value, the child field is shown.
     * @param childFieldId. The ID of the child field that will depend on the parent field.
     */
    public createDependency(dependency: Dependency<any>): void {

        // First, make sure that the fields for which we're creating the dependency exist
        let child: Field<any> | undefined = this.fields.get(dependency.childId)
        let parent: Field<any> | undefined = this.fields.get(dependency.parentId)

        if (child == undefined) {
            throw new Error(`Attempted to create a dependency for a non-existend field. [FieldId]:[${dependency.childId}].`)
        }

        if (parent == undefined) {
            throw new Error(`Attempted to create a dependency for a non-existend field. [FieldId]:[${dependency.parentId}].`)
        }

        // Check if we already have a dependency for the given child.
        let oldDep: Dependency<any> | undefined = this.children.get(dependency.childId)

        if (oldDep != undefined && oldDep.parentId != dependency.parentId) {
            throw new Error("The given child field already depends on another field!")
        }

        // If we don't, we track the dependency.
        this.children.set(dependency.childId, dependency)

        // We also track that the parent now has a new child.
        let parentChildren: string[] | undefined = this.parents.get(dependency.parentId)

        if (parentChildren == undefined) {
            this.parents.set(dependency.parentId, [dependency.childId])
        }
        else {
            parentChildren.push(dependency.childId)
        }

        // Finally, update the visibility of the child
        this._updateChildVisibility(child.id)
    }

    /**
     * Deletes a dependency between two fields.
     * 
     * @param dependency. The dependency that we want to delete.
     */
    public deleteDependency(dependency: Dependency<any> | undefined): void {

        // Delete the child dependency
        if (dependency == undefined) return

        this.children.delete(dependency.childId)

        // Set the visibility of the deleted child to visible
        let child = this.fields.get(dependency.childId)
        
        if (child != undefined) {
            child.visible = true
        }

        // Update the parent dependencies.
        let childIds: string[] | undefined = this.parents.get(dependency.parentId)

        if (childIds != undefined) {
            this.parents.set(dependency.parentId, childIds.filter(id => id != dependency.childId))
        }

        if (this.parents.get(dependency.parentId)?.length == 0) {
            this.parents.delete(dependency.parentId)
        }
    }

    /**
     * Gets all the dependencies for a given field ID.
     * 
     * @param fieldId. The ID of the field for which we want to get the dependencies.
     * @returns. An array of dependencies that the given field has. If no dependencies are found, return an empty array.
     */
    public getDependencies(fieldId: string): Dependency<any>[] {

        // If this is a child field, get its dependency.
        if (this._isChild(fieldId)) {
            let dep: Dependency<any> | undefined = this.children.get(fieldId)
            return dep == undefined ? [] : [dep]
        }
        // If this is a parent field, find all of its children and get their dependencies.
        else if (this._isParent(fieldId)) {
            let childIds: string[] | undefined = this.parents.get(fieldId)

            if (childIds != undefined) {
                let deps: Dependency<any>[] = childIds
                    .map(id => this.children.get(id)!) // Tell TS that there are no undefined values. There might be, but we filter them out in the next step.
                    .filter(dep => dep != undefined)

                for (let i = 0; i < deps.length; i++) {
                    this.deleteDependency(deps[i])
                }
            }
        }

        return []
    }

    /**
     * Check if a given field is a child of another field.
     * 
     * @param fieldId. The ID of the field in question.
     * @returns. A boolean that is true if the field is a child and false otherwise.
     */
    private _isChild(fieldId: string): boolean {
        return this.children.get(fieldId) != undefined
    }

    /**
     * Check if a given field is a parent.
     * 
     * @param fieldId. The ID of the field in question.
     * @returns. A boolean that is true if the field is a parent and false otherwise.
     */
    private _isParent(fieldId: string): boolean {
        return this.parents.get(fieldId) != undefined
    }

    /**
     * Updates the visibility of a child field.
     * 
     * @param id. The ID of the child for which we want to update the visibility.
     */
    private _updateChildVisibility(id: string): void {

        // First check if the child exists.
        let child = this.fields.get(id)

        if (child == undefined) {
            throw new Error(`Could not find the field! [FieldId]:[${id}].`)
        }

        // Now check if it has a dependency on anything. If it doesn't it's visible by default.
        let dep: Dependency<any> | undefined = this.children.get(id)

        if (dep == undefined) {
            child.visible = true
        }
        else {
            // If it has a dependency, we have to check the value of the parent
            let parent = this.fields.get(dep.parentId)

            if (parent == undefined) {
                throw new Error(`Expected parent but couldn't find it. [ParentId]:[${dep.parentId}].`)
            }

            child.visible = dep.equalsParentValue(parent.value)
        }
    }
}
