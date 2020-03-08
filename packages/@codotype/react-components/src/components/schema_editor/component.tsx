import * as React from "react";
import { SchemaSelector } from "./SchemaSelector";
import { SchemaDetail } from "./SchemaDetail";
import { SchemaNewButton } from "./SchemaNewButton";
import { DragDropContext } from "react-beautiful-dnd";
import { SchemaFormModal } from "./SchemaFormModal";
import { Schema } from "../types";

// // // //

const reorder = (list: any[], startIndex: number, endIndex: number): any[] => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
};

/**
 * SchemaEditorLayout
 * @param props.schemas
 * @param props.onChange
 */
export function SchemaEditorLayout(props: {
    schemas: Schema[];
    onChange: (updatedSchemas: Schema[]) => void;
}) {
    const [showModal, setShowModal] = React.useState(false);
    const [state, setState] = React.useState({ schemas: props.schemas });
    const [selectedSchemaId, setSelectedSchemaId] = React.useState<
        string | null
    >(null);

    // Update state.schemas when props.schemas changes
    React.useEffect(() => {
        setState({ schemas: props.schemas });
    }, [props.schemas]);

    // Invoke props.onChange when state.schemas has updated
    // React.useEffect(() => {
    //     // setState({ schemas: props.schemas });
    //     props.onChange(state.schemas);
    // }, [state.schemas]);

    // Sets selectedSchemaId if none is defined
    if (state.schemas[0] && selectedSchemaId == null) {
        setSelectedSchemaId(state.schemas[0].id);
        return null;
    }

    // Defines selectedSchema
    const selectedSchema: Schema | undefined = state.schemas.find(
        (s: Schema) => {
            return s.id === selectedSchemaId;
        },
    );

    // Show empty state
    if (selectedSchemaId === null || selectedSchema === undefined) {
        return <p>EmptyState</p>;
    }

    function onDragEnd(result: any) {
        if (!result.destination) {
            return;
        }

        if (result.destination.index === result.source.index) {
            return;
        }

        const updatedSchemas = reorder(
            state.schemas,
            result.source.index,
            result.destination.index,
        );

        setState({ schemas: updatedSchemas });
    }

    // Render schema editor layout
    return (
        <div className="row mt-3">
            <div className="col-lg-4">
                <SchemaNewButton
                    onClick={() => {
                        setShowModal(true);
                    }}
                />

                <SchemaFormModal
                    show={showModal}
                    handleClose={() => {
                        setShowModal(false);
                    }}
                >
                    <p>Schema Form Goes Here</p>
                </SchemaFormModal>

                <DragDropContext onDragEnd={onDragEnd}>
                    <SchemaSelector
                        schemas={state.schemas}
                        selectedSchemaId={String(selectedSchemaId)}
                        onChange={(updatedSelectedSchema: Schema) => {
                            setSelectedSchemaId(updatedSelectedSchema.id);
                        }}
                    />
                </DragDropContext>
            </div>
            <div className="col-lg-8">
                <SchemaDetail
                    schema={selectedSchema}
                    onConfirmDelete={() => {
                        // Defines updatedSchemas without `selectedSchema`
                        const updatedSchemas: Schema[] = state.schemas.filter(
                            (s: Schema) => {
                                return s.id !== selectedSchemaId;
                            },
                        );

                        // Invokes props.onChange with updated schemas
                        props.onChange(updatedSchemas);

                        // Sets selectedSchemaId to null
                        setSelectedSchemaId(null);
                    }}
                />
                <pre>
                    {JSON.stringify(
                        props.schemas.find(s => s.id === selectedSchemaId),
                        null,
                        4,
                    )}
                </pre>
            </div>
        </div>
    );
}
