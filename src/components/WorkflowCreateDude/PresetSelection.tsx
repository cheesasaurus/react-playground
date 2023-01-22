import styles from './WorkflowCreateDude.module.css';
import React from "react";
import { DudeModifierPreset } from '../../black-box/exposed/models';
import { DudeStatInfo, DudeStatType, DudeStatTypes } from '../../black-box/exposed/DudeStats';
import { cssClassNames, signedNumber } from '../../utils';

export interface PresetSelectionUpdateInfo<OptionIdType> {
    selectedOptionId: OptionIdType;
}

export type BaseStatMap = {
    [key in DudeStatType]: number;
}

interface Props<OptionIdType extends string> {
    title: string;
    selectedOptionId: string;
    options: Array<DudeModifierPreset<OptionIdType>>;
    baseStats: BaseStatMap;
    onUpdate: (info: PresetSelectionUpdateInfo<OptionIdType>) => void;
}

interface State {

}


export class PresetSelection<OptionIdType extends string> extends React.Component<Props<OptionIdType>, State> {

    private onOptionClicked = (optionId: OptionIdType) => {
        this.props.onUpdate({
            selectedOptionId: optionId,
        });
    };
    
    public render(): React.ReactNode {
        return (
            <div className={styles['preset-container']}>
                <section className={styles['stats-section']}>
                    <header className={styles['preset-label']}>{this.props.title} →</header>
                    <div className={styles['stat-list']}>
                        {this.renderStats()}
                    </div>
                </section>
                <section className={styles['preset-options']}>
                    {this.renderOptions()}
                </section>
            </div>
        );
    }

    private renderStats(): React.ReactNode {
        const preset = this.props.options.find(opt => opt.id === this.props.selectedOptionId)!;
        const magnitudeMap = Object.fromEntries(
            preset.statModifiers.map(mod => [mod.type, mod.magnitude])
        );

        return DudeStatTypes.map((statType) => {
            const base = this.props.baseStats[statType];
            const name = DudeStatInfo[statType].name;
            const magnitude = magnitudeMap[statType] || 0;

            return (
                <div key={statType} className={styles['stat']}>
                    <span className={styles['stat-name']}>{name}</span>
                    <span className={styles['stat-base']}>{base}</span>
                    {this.renderStatModifier(magnitude)}
                </div>
            );
        });
    }

    private renderStatModifier(magnitude: number): React.ReactNode {
        if (!magnitude) {
            return undefined;
        }
        const className = magnitude > 0 ? styles['modifier-positive'] : styles['modifier-negative'];
        return <span className={className}>{signedNumber(magnitude)}</span>;
    }

    private renderOptions(): React.ReactNode {
        return this.props.options.map(option => (
            <div
                key={option.id}
                onClick={() => this.onOptionClicked(option.id)}
                className={cssClassNames({
                    [styles['preset-option']]: true,
                    [styles['selected']]: this.props.selectedOptionId === option.id,
                })}
            >
                <div className={styles['preset-option-name']}>{option.name}</div>
                <div className={styles['preset-option-description']}>{option.description}</div>
            </div>
        ));
    }

}
