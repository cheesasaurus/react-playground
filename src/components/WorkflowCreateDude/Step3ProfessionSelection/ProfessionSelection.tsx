import React from "react";
import { Profession, ProfessionPresets } from "../../../black-box/exposed/DudeModifierPresets/Professions";
import { RacePresetsMap } from "../../../black-box/exposed/DudeModifierPresets/Races";
import { DudeStatTypes } from "../../../black-box/exposed/DudeStats";
import { Dude, DudeModifierPreset } from "../../../black-box/exposed/models";
import { BaseStatMap, PresetSelection, PresetSelectionUpdateInfo } from "../PresetSelection";


export interface ProfessionSelectionUpdateInfo {
    selectedProfession: Profession;
}

interface Props {
    selectedProfession: Profession;
    dude: Dude;
    onUpdate: (info: ProfessionSelectionUpdateInfo) => void;
}

interface State {

}

export class ProfessionSelection extends React.Component<Props, State> {
    presets: Array<DudeModifierPreset<Profession>>;

    public constructor(props: Props) {
        super(props);
        this.presets = [...ProfessionPresets].sort((a, b) => {
            return a.name < b.name ? -1 : 1;
        });
    }

    private onUpdate = (info: PresetSelectionUpdateInfo<Profession>) => {
        this.props.onUpdate({
            selectedProfession: info.selectedOptionId,
        });
    }

    private baseStats(): BaseStatMap {
        const dudeStats = this.props.dude.stats;
        const kvPairs = DudeStatTypes.map(statType => {
            const baseStat = dudeStats[statType].level;
            return [statType, baseStat.actual];
        });
        const baseStats = Object.fromEntries(kvPairs);

        // include boosts from step 2 (race selection)
        RacePresetsMap[this.props.dude.race].statModifiers.forEach(modifier => {
            baseStats[modifier.type] += modifier.magnitude;
        });

        return baseStats;
    }

    render(): React.ReactNode {
        return(
            <PresetSelection<Profession>
                selectedOptionId={this.props.selectedProfession}
                title={'Profession Selection'}
                options={this.presets}
                baseStats={this.baseStats()}
                onUpdate={this.onUpdate}
            />
        );
    }
}