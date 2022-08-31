import { Validator } from "../../../../validators/validator";
import { FIELD_TYPE } from "../fieldType";
import { Field } from "./field";

/**
 * The class that represents a dropdown where only a single value can be selected.
 */
export abstract class SingleSelectDropdownFieldAbstract<T, K> extends Field<T, K> {

    possibleValues: T[]

    /**
     * The constructor.
     * 
     * @param id. The ID of the field.
     * @param fieldType. The type of the field. This is how we differentiate between text fields, email fields etc.
     * @param value. The value of the field. This can be text, an array of URIs pointing to uploaded files etc. Each implementation of this
     *               class defines what value is for itself.
     * @param required. A boolean which indicates whether value needs to be set.
     * @param possibleValues. The values that we allow field to have. For a boolean form field this is true / false, for a single select field these are 
     *                        the values that can be selected.
     * @param validators. An array of validators that we use to constrain the value of the field. This can be min text length, max number of uploaded files etc.
     */
    constructor(
        id: string,
        fieldType: FIELD_TYPE,
        value: T | null,
        required: boolean,
        possibleValues: T[],
        validators: Validator<T>[]) {

        super(id, fieldType, value, required, validators)
        this.possibleValues = possibleValues
    }
}