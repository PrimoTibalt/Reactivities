import { Placeholder, Segment } from "semantic-ui-react";

export default function ActivityCardPlaceholder() {
    return (
        <>
            <Placeholder style={{ minWidth: 100 }}>
                <Segment.Group>
                    <Segment>
                        <Placeholder>
                            <Placeholder.Image rectangular>
                            </Placeholder.Image>
                        </Placeholder>
                    </Segment>
                    <Segment>
                        <Placeholder>
                            <Placeholder.Line length="full" />
                            <Placeholder.Line length="medium" />
                            <Placeholder.Line length="short" />
                        </Placeholder>
                    </Segment>
                </Segment.Group>
            </Placeholder>
        </>
    )
}