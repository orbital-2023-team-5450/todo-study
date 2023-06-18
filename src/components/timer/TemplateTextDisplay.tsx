import React from 'react';
import { FullWorkRestCycle, WorkRestCycle, timerToString } from "../../utils/timerUtils";

/**
 * A simple text-based component that displays the work-rest cycle details.
 * Takes in a prop, template, that represents the work-rest cycle.
 */
export default function TemplateTextDisplay( { template } : { template : WorkRestCycle | FullWorkRestCycle }) {
    return (template.rest !== 0) ? (
        <>
            Work: { timerToString(template.work, false, false) } &sdot; Rest: { timerToString(template.rest, false, false) } &sdot; Cycles: {template.cycles}
        </>
    ) : (
        <>
            Work: { timerToString(template.work, false, false) } &sdot; Cycles: {template.cycles}
        </>
    );
}