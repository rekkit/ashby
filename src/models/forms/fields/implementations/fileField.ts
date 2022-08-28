import { Validator } from "../../../../validators/validator";
import { Field } from "../abstract/field";
import { FIELD_TYPE } from "../fieldType";

/**
 * Represents a file field. The values of a file field are URLs which point to where the files are uploaded.
 */
export class FileField extends Field<string[]> {

    /**
     * The constructor.
     * 
     * @param id. The ID of this form field.
     * @param value. The value of this form field. We expect this to be a list of URIs pointing to files that have already been
     *               uploaded to a file store of our choice.
     * @param required. The field that indicates whether value needs to be set or not.
     */
    constructor(id: string, value: string[], required: boolean, validators: Validator<string[]>[] = []) {
        super(id, FIELD_TYPE.FILE, value, required, validators)
    }
}