
/**
 * An enum that represents the field types that we can have. This is used so that we know which class to instantiate for each field
 * when we get a form through an HTTP request.
 */
export enum FIELD_TYPE {
    TEXT,
    EMAIL,
    SINGLE_SELECT,
    BOOLEAN,
    FILE
}
