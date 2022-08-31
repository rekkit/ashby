import { v4 } from 'uuid'
import { Field } from "./fields/abstract/field";
import { Dependency } from "./fields/dependency";

/**
 * The class that represents a section.
 */
export class Section {

    // The ID of the section.
    id: string

    // This is where we keep all of the fields.
    fields: Map<string, Field<any, any>> = new Map()

    // This is where we track the order of the fields. This is an array which contains the 
    // IDs of the fields in the 'fields' member. The first ID in the array is the first field in the section.
    fieldOrder: string[] = []

    // These are the child fields, i.e. fields whose visibility (visible / hidden) depends on another field.
    children: Map<string, Dependency<any>> = new Map()

    // This is where we track the children of each field (if any).
    // This is so that we know exactly which fields to show / hide when we change a field that has children,
    // instead of iterating through all fields.
    parents: Map<string, string[]> = new Map()

    /**
     * 
     * @param id. The ID of the section.
     */
    constructor(id: string) {
        this.id = id
    }

    /**
     * Checks whether all the fields in the section are valid. If they are, we consider the section to be valid.
     */
    public isValid(): boolean {
        for (const [id, field] of this.fields) {
            if (!field.isValid()) return false
        }

        return true
    }

    /**
     * Creates a field. This will throw an exception if the field already exists.
     * 
     * @param field. The new field value that we want to add.
     */
    public createField(field: Field<any, any>): void {

        if (this.fields.has(field.id)) {
            throw new Error("Field already exists!")
        }

        this.fields.set(field.id, field)
        this.fieldOrder.push(field.id)
    }

    /**
     * Updates a field.
     * 
     * @param field. The new value of the field that we want to update. This will throw an error if the field
     * doesn't already exist.
     */
    public updateField(field: Field<any, any>): void {

        let oldField: Field<any, any> | undefined = this.fields.get(field.id)

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
     * Creates a field if it doesn't already exist. Otherwise it updates the existing field.
     * Used for handling PUT requests, which are create / update operations.
     * 
     * @param field. The field that we want to create or update.
     */
    public createOrUpdateField(field: Field<any, any>): void {

        if (!this.fields.has(field.id)) {
            this.createField(field)
        }
        else {
            this.updateField(field)
        }
    }

    /**
     * Delete a field. This will not throw an exception if the field does not exist because
     * the end result is the same.
     * 
     * @param fieldId. The ID of the field that we want to delete.
     */
    public deleteField(fieldId: string) {
        this.fields.delete(fieldId)
        this.fieldOrder = this.fieldOrder.filter(id => id != fieldId)

        let deps: Dependency<any>[] = this.getDependencies(fieldId)

        for (let i = 0; i < deps.length; i++) {
            this.deleteDependency(deps[i])
        }
    }

    /**
     * Moves a field to a given part of the section.
     * 
     * @param fieldId. The ID of the field that we want to move.
     * @param idx. The index where we want to move the field.
     */
    public moveField(fieldId: string, idx: number) {
        
        let fieldIdx: number = this._getFieldIdx(fieldId)
        this.fieldOrder.splice(fieldIdx, 1)
        this.fieldOrder.splice(idx, 0, fieldId)
    }

    /**
     * Duplicates a form field and inserts the new field after the old one.
     * 
     * @param fieldId. The ID of the field that we want to duplicate.
     */
    public duplicateField(fieldId: string) {

        let fieldIdx: number = this._getFieldIdx(fieldId)
        let field: Field<any, any> = this._getField(fieldId)
        
        let newId: string = v4()
        this.fields.set(newId, field.duplicate(newId))
        this.fieldOrder.splice(fieldIdx, 0, newId)
    }

    /**
     * Returns the list of field in the order they are meant to be displayed in.
     * 
     * @returns 
     */
    public getOrderedFields(): Field<any, any>[] {
        return this.fieldOrder.map(fId => this.fields.get(fId)!)
    }

    /**
     * Creates a dependency between two fields.
     * 
     * @param parentFieldId. The ID of the parent field. If this field has a certain value, the child field is shown.
     * @param childFieldId. The ID of the child field that will depend on the parent field.
     */
    public createDependency(dependency: Dependency<any>): void {

        // First, make sure that the fields for which we're creating the dependency exist
        let child: Field<any, any> | undefined = this.fields.get(dependency.childId)
        let parent: Field<any, any> | undefined = this.fields.get(dependency.parentId)

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

    /**
     * Returns the index (based on order) of the field with the given ID. Throws an exception if it can't find the field.
     * 
     * @returns. The (order) index of the field with the given ID.
     * @param id. The ID of the field that we're looking for.
     */
    private _getFieldIdx(id: string): number {

        let idx: number = this.fieldOrder.indexOf(id)
        if (idx < 0) throw new Error(`Could not find the field with the given ID. [Id]:[${id}]`)

        return idx
    }

    /**
     * Gets the field with the given ID. Throws an error if the field is not found.
     * 
     * @param id. The ID of the field that we want to fetch.
     * @returns The field with the given ID.
     */
    private _getField(id: string): Field<any, any> {

        let field: Field<any, any> | undefined = this.fields.get(id)
        if (field == undefined) throw new Error(`Could not find field. [Id]:[${id}]`)

        return field
    }
}
