import * as React from "react";
import { OptionType, ConfigurationGroupProperty } from "@codotype/types";
import classnames from "classnames";
import { DocumentationModal } from "../DocumentationModal";

// // // //

interface ConfigurationInputFormGroupProps {
    property: ConfigurationGroupProperty;
    card?: boolean;
    className?: string;
    children: React.ReactNode;
}

export function ConfigurationInputFormGroup(
    props: ConfigurationInputFormGroupProps,
) {
    const { className = "" } = props;

    const renderDocumentationModal: boolean =
        props.property.documentation !== "";

    const formGroup = (
        <div
            className={classnames("form-group mb-0", {
                [className]: className !== "",
            })}
        >
            {/* TODO - replace this with modified ConfigurationGroupHeader */}
            <div className="d-flex align-items-center">
                <div className="d-flex align-items-center">
                    {props.property.icon && (
                        <img
                            src={props.property.icon}
                            style={{ maxWidth: "2rem" }}
                            className="mr-2"
                        />
                    )}
                    <label className="mb-0">{props.property.label}</label>
                    {renderDocumentationModal && (
                        <small className="mx-3">
                            <DocumentationModal
                                header={props.property.label}
                                documentation={props.property.description} // TODO - update this to use property.documentation
                            />
                        </small>
                    )}
                </div>

                {props.property.type === OptionType.BOOLEAN && (
                    <div
                        className={classnames("d-flex align-items-center", {
                            "ml-3": !renderDocumentationModal,
                        })}
                    >
                        {props.children}
                    </div>
                )}
            </div>

            {/* Render description IFF not empty */}
            {props.property.description !== "" && (
                <small className="d-block mt-2 text-muted">
                    {props.property.description}
                </small>
            )}

            {/* Render empty description warning */}
            {props.property.description === "" && (
                <small className="d-block mt-2 mb-2 text-danger">
                    Warning - this input needs a description
                </small>
            )}

            {/* Renders props.children */}
            {props.property.type !== OptionType.BOOLEAN && (
                <React.Fragment>{props.children}</React.Fragment>
            )}
        </div>
    );

    // Return standard if NOT props.card
    if (!props.card) {
        return formGroup;
    }

    // Handle props.card
    return (
        <div className="row">
            <div className="col-lg-12">
                <div className="card shadow-sm my-2 py-3 px-3">{formGroup}</div>
            </div>
        </div>
    );
}