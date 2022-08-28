import { Validator } from "../../../../validators/validator";
import { Field } from "../abstract/field";
import { FIELD_TYPE } from "../fieldType";

/**
 * The class that represents a text field.
 */
export class TextField extends Field<string> {

    /**
     * The constructor.
     * 
     * @param id. The ID of this form field.
     * @param value. The value of this form field. Can by any string.
     * @param required. The field that indicates whether value needs to be set or not.
     * @param validators. The validators that we want to use to constrain value.
     */
    constructor(id: string, value: string | null, required: true, validators: Validator<string>[] = []) {
        super(id, FIELD_TYPE.TEXT, value, required, validators)
    }
}