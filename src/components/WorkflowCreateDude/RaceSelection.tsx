import React from "react";
import { Race, RacePresets } from "../../black-box/exposed/DudeModifierPresets/Races";
import { DudeStatTypes } from "../../black-box/exposed/DudeStats";
import { Dude } from "../../black-box/exposed/models";
import { BaseStatMap, PresetSelection, PresetSelectionUpdateInfo } from "./PresetSelection";


export interface RaceSelectionUpdateInfo {
    selectedRace: Race;
}

interface Props {
    selectedRace: Race;
    dude: Dude;
    onUpdate: (info: RaceSelectionUpdateInfo) => void;
}

interface State {

}

export class RaceSelection extends React.Component<Props, State> {


    private onUpdate = (info: PresetSelectionUpdateInfo<Race>) => {
        this.props.onUpdate({
            selectedRace: info.selectedOptionId,
        });
    }

    private baseStats(): BaseStatMap {
        const dudeStats = this.props.dude.stats;
        const kvPairs = DudeStatTypes.map(statType => {
            const baseStat = dudeStats[statType].level;
            return [statType, baseStat.actual];
        });
        return Object.fromEntries(kvPairs);
    }

    render(): React.ReactNode {
        return(
            <PresetSelection<Race>
                selectedOptionId={this.props.selectedRace}
                title={'Race Selection'}
                options={RacePresets}
                baseStats={this.baseStats()}
                onUpdate={this.onUpdate}
            />
        );
    }
}