import { FIELD_TYPE } from "../fieldType";
import { SingleSelectDropdownFieldAbstract } from "../abstract/singleSelectDropdownFieldAbstract";
import { ArrayContainsValueValidator } from "../../../../validators/arrayContainsValueValidator";

export class BooleanField extends SingleSelectDropdownFieldAbstract<boolean, BooleanField> {

    /**
     * The constructor.
     * 
     * @param id. The ID of this form field.
     * @param value. The value of this form field. Can be true, false or null if it's not required.
     * @param required. The field that indicates whether value needs to be set or not.
     */
    constructor(
        id: string,
        value: boolean | null,
        required: boolean) {

        super(
            id,
            FIELD_TYPE.BOOLEAN,
            value,
            required,
            [true, false],
            [new ArrayContainsValueValidator<boolean>([true, false])])
    }

    public duplicate(id: string): BooleanField {
        return new BooleanField(id, this.value, this.required)
    }
}
