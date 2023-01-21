import styles from './WorkflowCreateDude.module.css';
import React from "react";
import { DudeModifierPreset } from '../../black-box/exposed/models';
import { DudeStatType } from '../../black-box/exposed/DudeStats';
import { cssClassNames } from '../../utils';

export interface PresetSelectionUpdateInfo<OptionIdType> {
    selectedOptionId: OptionIdType;
}

export type BaseStatMap = {
    [key in DudeStatType]: number;
}

interface Props<OptionIdType extends string> {
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
    
    render(): React.ReactNode {
        return (
            <div className={styles['step-2-container']}>
                <section className={styles['stats']}>
                    <header className={styles['preset-label']}>Race Selection</header>
                    stats go here
                </section>
                <section className={styles['preset-options']}>
                    {this.renderOptions()}
                </section>
            </div>
        );
    }

    renderOptions(): React.ReactNode {
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
