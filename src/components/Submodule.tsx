/* eslint-disable jsx-a11y/alt-text */
import { useContext } from 'react';
import AppContext from '../context/AppContext';
import '../styles/schedule.scss';
import { ICurriculum, IModule, ISubmodule, IFlashcard, IToolItem, IMoreInfo } from '../models/interfaces';
import Day from './Day';
import { useState } from 'react';
import * as qdat from '../qtools/qdat';
import { TaskItems } from './TaskItems';
import { ToolItems } from './ToolItems';
import { Overview } from './Overview';
import { Objectives } from './Objectives';
import { Resources } from './Resources';
import { Flashcards } from './Flashcards';

interface ISubmoduleProps {
	module: IModule;
	initialSubmodule: ISubmodule;
	curriculum: ICurriculum;
}

function Submodule(props: ISubmoduleProps) {
	const { module, initialSubmodule, curriculum } = props;
	const [submodule, setSubmodule] = useState(initialSubmodule);
	const modKey = module.abbreviation;
	const subKey = submodule.abbreviation;
	const { ASM } = useContext(AppContext);

	const flashcardInfo = ASM.getFlashcardsInfoForSubmodule(modKey, subKey);

	const buildMoreInfos = (moreInfos: IMoreInfo[]): string => {
		const htmlMoreInfos = moreInfos.map((moreInfo: IMoreInfo) => {
			return `<a target="_blank" href="${moreInfo.url}">${moreInfo.title}</a>`;
		});
		return `<span class="moreInfosLabel">More Infos:</span> ${htmlMoreInfos.join(', ')}`;
	}

	const toggleSubmoduleCollapse = () => {
		submodule.collapsed = !submodule.collapsed;
		if (submodule.collapsed) {
			submodule.days.forEach(day => day.collapsed = true);
		}
		submodule.objectivesCollapsed = true;
		submodule.resourcesCollapsed = true;
		submodule.flashcardsCollapsed = true;
		setSubmodule({ ...submodule });
	}

	const toggleOverviewCollapse = () => {
		submodule.overviewCollapsed = !submodule.overviewCollapsed;
		setSubmodule({ ...submodule });
	}

	const toggleObjectivesCollapse = () => {
		submodule.objectivesCollapsed = !submodule.objectivesCollapsed;
		setSubmodule({ ...submodule });
	}

	const toggleResourcesCollapse = () => {
		submodule.resourcesCollapsed = !submodule.resourcesCollapsed;
		setSubmodule({ ...submodule });
	}
	const toggleFlashcardsCollapse = () => {
		submodule.flashcardsCollapsed = !submodule.flashcardsCollapsed;
		submodule.flashcards.forEach((flashcard: IFlashcard) => {
			flashcard.showBack = false;
		});
		setSubmodule({ ...submodule });
	}
	const toggleTaskItemsCollapse = () => {
		submodule.taskItemsCollapsed = !submodule.taskItemsCollapsed;
		setSubmodule({ ...submodule });
	}
	const toggleToolItemsCollapse = () => {
		submodule.toolItemsCollapsed = !submodule.toolItemsCollapsed;
		setSubmodule({ ...submodule });
	}

	const getDayString = () => {
		const shortDates = submodule.days.map(day => `<span class="theListDay ${day.kind}">${qdat.getShortAmericanMonthDay(day.date)}</span>`);
		return shortDates.join(' - ');
	}

	const toggleFlashcard = (flashcard: IFlashcard) => {
		flashcard.showBack = !flashcard.showBack;
		setSubmodule({ ...submodule });
	}

	const toggleToolItem = (toolItem: IToolItem) => {
		toolItem.showNotes = !toolItem.showNotes;
		setSubmodule({ ...submodule });
	}

	const totalItems = 1 + submodule.objectives.length + submodule.resources.length + submodule.flashcards.length + submodule.taskItems.length + submodule.toolItems.length;
	const totalMarkedItems = flashcardInfo.marked; 

	return (
		<section className="submodule">
			<h2 onClick={() => toggleSubmoduleCollapse()}>{submodule.title}
				<div className="previewIcons">
					{submodule.collapsed && (
						<>
							{submodule.overview !== '' && (
								<div className="previewIconOverview">1</div>
							)}
							{submodule.objectives.length > 0 && (
								<div className="previewIconObjectives">{submodule.objectives.length}</div>
							)}
							{submodule.resources.length > 0 && (
								<div className="previewIconResources">{submodule.resources.length}</div>
							)}
							{submodule.flashcards.length > 0 && (
								<div className="previewIconFlashcards">{submodule.flashcards.length}</div>
							)}
							{submodule.taskItems.length > 0 && (
								<div className="previewIconTaskItems">{submodule.taskItems.length}</div>
							)}
							{submodule.toolItems.length > 0 && (
								<div className="previewIconToolItems">{submodule.toolItems.length}</div>
							)}
							<div className="scoreMessage">{totalMarkedItems} of {totalItems} items accomplished</div>
						</>
					)}<span className="numberOfDays"></span>
				</div>
				<span className="dayString">{submodule.collapsed && (<span dangerouslySetInnerHTML={{ __html: getDayString() }} />)}</span>

			</h2>
			{!submodule.collapsed && (
				<>
					<Overview submodule={submodule} toggleOverviewCollapse={toggleOverviewCollapse} />
					<Objectives submodule={submodule} toggleObjectivesCollapse={toggleObjectivesCollapse} />
					<Resources submodule={submodule} toggleResourcesCollapse={toggleResourcesCollapse} />
					<ToolItems module={module} submodule={submodule} toggleToolItemsCollapse={toggleToolItemsCollapse} toggleToolItem={toggleToolItem} setSubmodule={setSubmodule} />
					<TaskItems submodule={submodule} toggleTaskItemsCollapse={toggleTaskItemsCollapse} />
					<Flashcards module={module} submodule={submodule} toggleFlashcardsCollapse={toggleFlashcardsCollapse} toggleFlashcard={toggleFlashcard} buildMoreInfos={buildMoreInfos} setSubmodule={setSubmodule} />

					<section className="days">
						{submodule.days.map((day, index) => {
							return (
								<Day initialDay={day} key={index} curriculum={curriculum} />
							)
						})}
					</section>
				</>
			)}
		</section>
	)
}

export default Submodule;

