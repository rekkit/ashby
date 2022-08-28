import { Validator } from "../../../../validators/validator";
import { FIELD_TYPE } from "../fieldType";

/**
 * The base field class.
 */
export abstract class Field<T> {

    // The ID of this field.
    id: string

    // The type of field.
    fieldType: FIELD_TYPE

    // The value of the field. Can be anything, including an array.
    value: T | null

    // Whether the field is required or not
    required: boolean

    // Whether this field is visible in the form or not.
    visible: boolean

    // The validator that we use to constrain the value of the field.
    validators: Validator<T>[]

    /**
     * The constructor.
     * 
     * @param id. The ID of the field.
     * @param fieldType. The type of the field. This is how we differentiate between text fields, email fields etc.
     * @param value. The value of the field. This can be text, an array of URIs pointing to uploaded files etc. Each implementation of this
     *               class defines what value is for itself.
     * @param required. A boolean which indicates whether value needs to be set.
     * @param validators. An array of validators that we use to constrain the value of the field. This can be min text length, max number of uploaded files etc.
     */
    constructor(id: string, fieldType: FIELD_TYPE, value: any, required: boolean, validators: Validator<T>[]) {
        this.id = id
        this.fieldType = fieldType
        this.value = value
        this.required = required
        this.validators = validators
        this.visible = true
    }

    /**
     * Returns whether the field is valid or not. Each field type should define what this method means for it.
     */
    public isValid(): boolean {

        // Check if the value is there if it's required.
        if (this.required == true && this.value == null) return false

        // Next, run through all the validators and check if the conditions are met. Return false if not.
        for (let i = 0; i < this.validators.length; i++) {
            if (this.value != null && !this.validators[i].isValid(this.value)) return false
        }

        // If we've made it this far, the form field is valid.
        return true
    }
}