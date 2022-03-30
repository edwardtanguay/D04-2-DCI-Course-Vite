import rawCurriculum from '../data/document_curriculum.json';
import { IExerciseStatusItem, IResource, ActivityCurriculumStatus, IVideo, IDay, IModule, ICurriculum, ISubmodule, IActivity, ITopic, IActivityStatus, IFlashcard, IMoreInfo, ITaskItem, IToolItem } from './interfaces';
import * as qstr from '../qtools/qstr';
import * as qdat from '../qtools/qdat';
import OutlineTextParser from '../classes/outlineTextParser';

let today = qdat.getCurrentIsoDate();
// today = '2021-08-30';

const getActivityStatus = (status: any): IActivityStatus => {
	if (status === undefined) {
		return {
			"finished": "",
			"unfinished": "",
			numberFinished: 0,
			numberUnfinished: 0
		};
	} else {
		return {
			finished: status.finished === undefined ? '' : status.finished,
			unfinished: status.unfinished === undefined ? '' : status.unfinished,
			numberFinished: status.finished === undefined || status.finished === '' ? 0 : status.finished.split(',').length,
			numberUnfinished: status.unfinished === undefined || status.unfinished === '' ? 0 : status.unfinished.split(',').length
		}
	}
}
const getExerciseNumber = (rawActivity: any) => {
	//https://github.com/FbW-D01/Exercise-408-SPA-DOM-Event-Item-Toggle" --> "408"
	if (!valueIsEmpty(rawActivity.url)) {
		const parts = qstr.breakIntoParts(rawActivity.url, '-');
		let number = parts[2];
		if (number === 'PB') {
			number = parts[1];
		}
		return number;
	} else {
		return '';
	}
}

const buildTopicTitle = (rawTitle: string) => {
	let r = '';
	r = rawTitle;
	r = qstr.parseMarkDown(r, { suppressParagraphMarks: true, suppressOrderedListElements: false });
	r = r.replaceAll('&amp;', '&');
	return r;
};

const getTopics = (rawTopics: any[] = []): ITopic[] => {
	const topics: ITopic[] = [];
	rawTopics.forEach(rawTopic => {
		const topic = {
			title: buildTopicTitle(rawTopic.title),
			url: rawTopic.url,
			notes: rawTopic.notes !== undefined ? rawTopic.notes : []
		};
		if (topic.title !== 'nnn') {
			topics.push(topic);
		}
	});
	return topics;
}

const getVideos = (rawVideos: any[] = []) => {
	const videos: IVideo[] = [];
	rawVideos.forEach((rawVideo: any) => {
		videos.push({
			description: rawVideo.description,
			url: rawVideo.url,
			extra: rawVideo.extra
		});
	})
	return videos;
}

const valueIsEmpty = (value: string) => {
	return value === 'nnn' || value === undefined || value === '';
}

const getActivities = (rawActivities: any[] = []) => {
	const activities: IActivity[] = [];
	rawActivities.forEach((rawActivity: any, index) => {
		let exerciseNumber = getExerciseNumber(rawActivity);
		// TODO: add third status: online
		const released = rawActivity.released === undefined ? false : rawActivity.released;
		let curriculumStatus = released ? ActivityCurriculumStatus.released : valueIsEmpty(rawActivity.url) ? ActivityCurriculumStatus.raw : ActivityCurriculumStatus.repositoryExerciseCreated;

		//override curriculum status
		if (rawActivity.cancelled) {
			curriculumStatus = ActivityCurriculumStatus.cancelled;
		}
		if (rawActivity.title === undefined) {
			curriculumStatus = ActivityCurriculumStatus.raw;
		}

		//image for activity
		let imagePathAndFileName = '';
		switch (curriculumStatus) {
			case ActivityCurriculumStatus.released:
				imagePathAndFileName = `images/activities/${exerciseNumber}.png`;
				break;
			case ActivityCurriculumStatus.repositoryExerciseCreated:
				imagePathAndFileName = `images/activities/underConstruction.png`;
				break;
			case ActivityCurriculumStatus.raw:
				imagePathAndFileName = `images/activities/planned.png`;
				break;
			default:
				imagePathAndFileName = `images/activities/unknown.png`;
				break;
		}

		const cancelled = (!rawActivity.cancelled || rawActivity.cancelled === undefined) ? false : true;
		const exerciseSymbol = '#'; // curriculumStatus === ActivityCurriculumStatus.released ? '#' : '';
		const url = curriculumStatus !== ActivityCurriculumStatus.raw && rawActivity.url !== undefined && rawActivity.url !== 'nnn' ? rawActivity.url : '';
		const dciExerciseUrl = rawActivity.dciExerciseUrl === undefined ? '' : rawActivity.dciExerciseUrl;
		const dciSolutionUrl = rawActivity.dciSolutionUrl === undefined ? '' : rawActivity.dciSolutionUrl;
		let description = rawActivity.description !== 'nnn' ? rawActivity.description : buildDescriptionFromDciLinks(dciExerciseUrl);
		// let description = rawActivity.description;
		const rawTopics = rawActivity.rawTopics === undefined ? '' : prepareRawTopicsTextForHtml(rawActivity.rawTopics);
		const time = rawActivity.time === undefined ? '' : rawActivity.time;
		const title = rawActivity.title !== undefined ? rawActivity.title : ''
		const exerciseCode = '';
		const dciActivityCode = getDciActivityCode(dciExerciseUrl, title);
		const dciActivityTitle = getDciActivityTitle(dciActivityCode);

		// if (description === undefined && title !== '') {
		// 	description = title;
		// }

		// image
		if (rawActivity.kind === 'activity') {
			imagePathAndFileName = 'images/activities/activity.png';
		}
		if (rawActivity.kind === 'explanation') {
			imagePathAndFileName = 'images/activities/explanation.png';
		}
		if (rawActivity.kind === 'liveCoding') {
			imagePathAndFileName = 'images/activities/liveCoding.png';
		}
		if (rawActivity.kind === 'realLifeCodeAnalysis') {
			imagePathAndFileName = 'images/activities/realLifeCodeAnalysis.png';
		}
		if (rawActivity.kind === 'extraCredit') {
			imagePathAndFileName = 'images/activities/extraCredit.png';
		}
		if (rawActivity.image !== undefined && rawActivity.image !== '') {
			imagePathAndFileName = `images/activities/${rawActivity.image}.png`;
		}
		if (rawActivity.kind === 'assessment') {
			imagePathAndFileName = 'images/activities/assessment.png';
		}
		if (cancelled) {
			imagePathAndFileName = `images/activities/cancelled.png`;
			exerciseNumber = 'cancelled';
		}

		const activity = {
			kind: rawActivity.kind,
			url,
			rank: rawActivity.rank === undefined ? -1 : rawActivity.rank,
			topics: getTopics(rawActivity.topics),
			description,
			exerciseNumber,
			imagePathAndFileName,
			status: getActivityStatus(rawActivity.status),
			exerciseSymbol,
			dciExerciseUrl,
			dciSolutionUrl,
			rawTopics,
			time,
			curriculumStatus,
			released,
			exerciseCode,
			dciActivityCode,
			dciActivityTitle,
			displayKind: rawActivity.kind === 'exercise' ? 'Exercise' : rawActivity.kind,
			title,
			cancelled,
			cancelledReason: rawActivity.cancelledReason,
			createExerciseUrl: buildCreateExerciseUrl(rawActivity),
			readmeCopyText: createReadmeCopyText(rawActivity),
			outlineHtml: buildOutlineHtml(rawActivity.outline),
			outlineCopyTextShowing: false,
			outlineCopyText: rawActivity.outline,
			adminMessage: valueIsEmpty(rawActivity.adminMessage) ? '' : rawActivity.adminMessage,
			preliveCode: valueIsEmpty(rawActivity.preliveCode) ? '' : rawActivity.preliveCode
		};
		activities.push(activity);
	})
	return activities;
}

const getTimeStatus = (isoDate: string) => {
	if (isoDate > today) {
		return 'future';
	} else if (isoDate < today) {
		return 'past';
	} else {
		return 'today';
	}
}

function getExerciseStatusItems(activities: IActivity[]): IExerciseStatusItem[] {
	const exerciseStatusItems: IExerciseStatusItem[] = [];
	activities.forEach(activity => {
		if (activity.kind === 'exercise' && !activity.cancelled) {
			const exerciseStatusItem: IExerciseStatusItem = {
				exerciseNumber: activity.exerciseNumber,
				numberFinished: 0,
				numberUnfinished: 0
			};
			if (activity.status.finished === undefined || activity.status.finished === '') {
				exerciseStatusItem.numberFinished = 0;
			} else {
				exerciseStatusItem.numberFinished = activity.status.finished.split(',').length;
			}
			if (activity.status.unfinished === undefined || activity.status.unfinished === '') {
				exerciseStatusItem.numberUnfinished = 0;
			} else {
				exerciseStatusItem.numberUnfinished = activity.status.unfinished.split(',').length;
			}
			exerciseStatusItems.push(exerciseStatusItem);
		}
	})
	return exerciseStatusItems;
}

const getDays = (rawSubmodule: any, rawModule: any): IDay[] => {
	const rawDays: any[] = rawSubmodule.days;
	const days: IDay[] = [];
	rawDays.forEach((rawDay: any) => {
		const activities = getActivities(rawDay.activities);
		const videos = getVideos(rawDay.videos);
		let title = (rawDay.title === undefined || rawDay.title === 'nnn') ? '' : rawDay.title;
		let kind = rawDay.kind === undefined ? 'class' : rawDay.kind;
		if (kind === 'mentoring') {
			title = 'Mentoring';
		}
		if (kind === 'freeDay' || kind === 'free') {
			kind = 'freeDay';
			title = title === '' ? 'FREE DAY' : `FREE DAY: ${title}`;
		}
		const day: IDay = {
			date: rawDay.date,
			activities,
			videos: videos,
			collapsed: true,
			title,
			timeStatus: getTimeStatus(rawDay.date),
			exerciseStatusItems: getExerciseStatusItems(activities),
			courseBookCopyText: buildCourseBookCopyText(activities, videos, title, rawDay.date, rawSubmodule, rawModule),
			submoduleAbbreviation: rawSubmodule.abbreviation,
			bulkTopics: prepareRawTopicsTextForHtml(rawDay.bulkTopics),
			kind
		};
		days.push(day);
	});
	return days;
}

const getObjectives = (rawObjectives: string[]) => {
	if (rawObjectives === undefined) return [];
	return rawObjectives.map((rawObjective => qstr.parseMarkDown(rawObjective, { suppressParagraphMarks: true, suppressOrderedListElements: false })));
}

const getSubmodules = (rawSubmodules: any[] = [], rawModule: any) => {
	const submodules: ISubmodule[] = [];
	rawSubmodules.forEach((rawSubmodule: any) => {
		const overview = rawSubmodule.overview === undefined ? '' : rawSubmodule.overview;

		const submodule: ISubmodule = {
			title: rawSubmodule.title,
			objectives: getObjectives(rawSubmodule.objectives),
			days: getDays(rawSubmodule, rawModule),
			collapsed: true,
			overviewCollapsed: true,
			objectivesCollapsed: true,
			resourcesCollapsed: true,
			flashcardsCollapsed: true,
			abbreviation: rawSubmodule.abbreviation,
			resources: buildResources(rawSubmodule.resources),
			overview,
			flashcards: buildFlashcards(rawSubmodule.flashcards),
			totalDays: rawSubmodule.totalDays,
			taskItemsCollapsed: true,
			taskItems: buildTaskItems(rawSubmodule.taskItems),
			toolItemsCollapsed: true,
			toolItems: buildToolItems(rawSubmodule.toolItems)
		}
		submodules.push(submodule);
	});
	return submodules;
}

const getCurriculum = (): ICurriculum => {
	const modules: IModule[] = rawCurriculum.modules.map(rawModule => {
		return {
			title: rawModule.title,
			abbreviation: rawModule.abbreviation,
			submodules: getSubmodules(rawModule.submodules, rawModule)
		}
	});
	const lastExerciseNumber = getLastExerciseNumber(modules);
	const curriculum: ICurriculum = {
		className: rawCurriculum.className,
		modules,
		adminAccess: false,
		// adminAccess: true,
		lastExerciseNumber
	};
	createDynamicExerciseCodesForNewExercises(curriculum);
	return curriculum;
};

function buildDescriptionFromDciLinks(dciExerciseUrl: string) {
	// e.g. https://github.com/DigitalCareerInstitute/Browser-modules-basics/tree/master
	const parts = qstr.breakIntoParts(dciExerciseUrl, '/');
	let description = parts[4];
	description = description.replaceAll('-', ' ');
	description = qstr.forceTitleNotation(description);
	description = `${description}`;
	return description;
}

function prepareRawTopicsTextForHtml(rawTopics: string) {
	// e.g. \"Module Basics:\r\n- Brief overview of IIFE and the Module pattern\r\n- Advantages of scope isolation and encapsulation\r\n- Using modules in the browser: `<script type=\"\"module\"\" src=\"\"...\"\">`\r\n- Connecting files: The `import` and `export` keywords\"
	// let r = '';
	// r = rawTopics.trim();
	// r = rawTopics.replaceAll('\r\n\\"', '\r\n');	
	// r = rawTopics.replaceAll('\r\n', '<br/>');
	// return r;
	const lines = qstr.convertStringBlockToLines(rawTopics);
	return lines.map(m => {
		m = qstr.chopLeft(m, '"');
		m = qstr.chopRight(m, '"');
		m = qstr.encodeHtmlForDisplay(m);
		return m;
	}).join('<br/>');
}

function getAllExercises(modules: IModule[]): IActivity[] {
	const allExercises: IActivity[] = [];
	modules.forEach(module => {
		module.submodules.forEach(submodule => {
			submodule.days.forEach(day => {
				day.activities.forEach(activity => {
					allExercises.push(activity);
				});
			});
		});
	});
	return allExercises;
}

function getLastExerciseNumber(modules: IModule[]): number {
	const allExercises = getAllExercises(modules);
	let lastExerciseNumber = 0;
	allExercises.forEach(exercise => {
		// e.g. https://github.com/FbW-D01/Exercise-404-SPA-DOM-Traversing-Html-With-JavaScript
		const parts = qstr.breakIntoParts(exercise.url, '/');
		const exerciseTitle = parts[4]; // e.g. Exercise-404-SPA-DOM-Traversing-Html-With-JavaScript
		const pieces = qstr.breakIntoParts(exerciseTitle, '-');
		const stringNumber = pieces[1];
		if (stringNumber !== undefined) {
			lastExerciseNumber = Number(stringNumber);
		}
	});
	return lastExerciseNumber;
}

function createDynamicExerciseCodesForNewExercises(curriculum: ICurriculum) {
	let currentExerciseNumber = curriculum.lastExerciseNumber;
	curriculum.modules.forEach(module => {
		module.submodules.forEach(submodule => {
			submodule.days.forEach(day => {
				day.activities.forEach(activity => {
					if (activity.url === '' && activity.kind === 'exercise' && !activity.cancelled) {
						currentExerciseNumber++;
						// e.g. https://github.com/FbW-D01/Exercise-401-SPA-DOM-Window-Prompt-Guessing-Game
						activity.exerciseCode = cleanExerciseCode(`Exercise-${currentExerciseNumber}-${module.abbreviation}-${submodule.abbreviation}-${activity.dciActivityCode}`);
						activity.exerciseNumber = String(currentExerciseNumber);
					}
				})
			})
		})
	})
}

function getDciActivityCode(dciExerciseUrl: string, title: string) {
	if (dciExerciseUrl === '') {
		return qstr.forceCamelNotation(title);
	} else {
		// e.g. https://github.com/DigitalCareerInstitute/Browser-modules-basics/tree/master
		const parts = qstr.breakIntoParts(dciExerciseUrl, '/');
		return parts[4];
	}
}

function getDciActivityTitle(dciActivityCode: string) {
	// e.g. Browser-modules-basics 
	if (dciActivityCode === undefined) return '';
	let r = dciActivityCode;
	r = r.replaceAll('-', ' ');
	return qstr.forceTitleNotation(r);
}

function buildResources(rawResources: any): IResource[] {
	const resources: IResource[] = [];

	rawResources.forEach((rawResource: any) => {
		if (rawResource.url !== 'uuu') {
			resources.push({
				title: buildSmartResourceTitle(rawResource),
				url: rawResource.url,
				notes: buildSmartResourceNotes(rawResource),
				rank: 1.1,
				iconFileName: buildIconFileName(rawResource),
				time: rawResource.time === undefined ? '' : rawResource.time,
			});
		}
	})

	return resources;
}

function buildSmartResourceTitle(rawResource: any): string {
	if ((rawResource.title !== undefined && rawResource.title !== 'nnn')) {
		return rawResource.title;
	} else {
		return qstr.getSmartTitleFromUrl(rawResource.url);
	}
}

function buildSmartResourceNotes(rawResource: any): string[] {
	if (rawResource.notes === undefined) return [];
	return rawResource.notes.map((note: string) => qstr.parseMarkDown(note, { suppressParagraphMarks: true, suppressOrderedListElements: true }));
}

function buildIconFileName(rawResource: any): string {
	if (rawResource.url.includes('stackoverflow.com')) {
		return 'resourceType_stackoverflow.png';
	}
	if (rawResource.url.includes('developer.mozilla.org')) {
		return 'resourceType_mdn.png';
	}
	if (rawResource.url.includes('youtube.com')) {
		return 'resourceType_youtube.png';
	}
	if (rawResource.url.includes('reactjs.org')) {
		return 'resourceType_reactorg.png';
	}
	if (rawResource.url.includes('w3schools')) {
		return 'resourceType_w3schools.png';
	}
	return 'resourceType_article.png';
}

export default getCurriculum();
export const curriculumDays = ((): IDay[] => {
	const days: IDay[] = [];
	getCurriculum().modules.forEach(module => module.submodules.map(submodule => submodule.days.map(day => days.push(day))));
	return days;
})();

function buildCourseBookCopyText(activities: IActivity[], videos: IVideo[], dayTitle: string, dayDate: string, rawSubmodule: any, rawModule: any): string {
	const divider = '='.repeat(dayTitle.length + 10);
	let lines: string[] = [];

	// header
	lines.push(`${rawModule.abbreviation} - ${rawSubmodule.title}`);
	lines.push(divider);
	lines.push(`${dayTitle.toUpperCase()}`)
	lines.push(`${qdat.getShortAmericanDateWithDay(dayDate)}`);
	lines.push(divider);
	lines.push('');

	// activity info
	activities.forEach(activity => {
		if (!activity.cancelled) {
			switch (activity.kind) {
				case 'extraCredit':
					lines.push(`EXTRA-CREDIT: ${activity.title}`);
					break;
				case 'selfStudy':
					lines.push(`SELF-STUDY: ${activity.title}`);
					break;
				case 'liveCoding':
					lines.push(`LIVE-CODING: ${activity.title}`);
					break;
				case 'realLifeCodeAnalysis':
					lines.push(`REAL-LIFE-CODE-ANALYSIS: ${activity.title}`);
					break;
				case 'exercise':
					lines.push(`EXERCISE #${activity.exerciseNumber}: ${activity.title}`);
					lines.push(activity.url);
					break;
				default:
					lines.push(`${activity.kind.toUpperCase()}: ${activity.title}`);
					break;
			}
			lines.push('');
		}
	});
	videos.forEach(video => {
		lines.push(`CLASSROOM-VIDEO: ${video.description}`);
		lines.push(video.url);
		lines.push('');
	});
	lines = lines.slice(0, -1);
	return lines.join('\n');
}

// from: Exercise-452-SPA-COM-SPA-lightSwitch
// to: Exercise-452-SPA-COM-lightSwitch
function cleanExerciseCode(exerciseCode: string): string {
	const parts = qstr.breakIntoParts(exerciseCode, '-');
	const newParts: string[] = [];
	let alreadyFound = false;
	parts.forEach(part => {
		if (part === 'SPA' || part === 'BE') {
			if (alreadyFound) {
				return;
			} else {
				alreadyFound = true;
			}
		}
		newParts.push(part);
	});
	return newParts.join('-');
}

function buildCreateExerciseUrl(rawActivity: any): string {
	if (rawActivity.dciExerciseUrl) {
		return rawActivity.dciExerciseUrl;
	}
	return 'https://github.com/organizations/FbW-D01/repositories/new';
}

function createReadmeCopyText(rawActivity: any): string {
	const lines: string[] = [];
	lines.push(`# ${rawActivity.title}`);
	lines.push('');
	lines.push(rawActivity.description);
	lines.push('');
	lines.push('## Instructions');
	lines.push('');
	lines.push('- nnn');
	return lines.join('\n');
}

function buildOutlineHtml(outline: string) {
	const lines = qstr.convertStringBlockToLines(outline);
	if (valueIsEmpty(outline)) {
		return '';
	} else if (lines.length === 1) {
		const cleanedOutline = qstr.chopLeft(outline, '- ');
		return qstr.parseMarkDown(cleanedOutline);
	} else {
		// return qstr.parseMarkDown(outline);
		const outlineTextParser = new OutlineTextParser(outline);
		outlineTextParser.parse();
		const html = outlineTextParser.displayParsed();
		return html;
	}
}

function buildTaskItems(rawTaskItems: any[]): ITaskItem[] {
	const taskItems: ITaskItem[] = [];
	if (rawTaskItems) {
		rawTaskItems.forEach(rawTaskItem => {
			taskItems.push({
				title: rawTaskItem.title === undefined ? '' : rawTaskItem.title,
				tagsArray: rawTaskItem.tags === undefined ? [] : qstr.breakIntoParts(rawTaskItem.tags, ','),
				difficulty: rawTaskItem.difficulty === undefined ? 2.5 : rawTaskItem.difficulty,
				timeInMinutes: rawTaskItem.timeInMinutes === undefined ? 0 : rawTaskItem.timeInMinutes,
				instructionOrder: rawTaskItem.instructionOrder === undefined ? 999 : rawTaskItem.instructionOrder
			})
		})
	}
	return taskItems;
}

function buildToolItems(rawToolItems: any[]): IToolItem[] {
	const toolItems: IToolItem[] = [];
	if (rawToolItems) {
		rawToolItems.forEach(rawToolItem => {
			toolItems.push({
				title: rawToolItem.title === undefined ? '' : rawToolItem.title,
				kind: rawToolItem.kind === undefined ? '' : rawToolItem.kind,
				notes: rawToolItem.notes === undefined ? '' : rawToolItem.notes,
				rank: rawToolItem.title === 2.5 ? '' : rawToolItem.rank,
				idCode: qstr.forceCamelNotation(rawToolItem.title),
				showNotes: false,
				outlineTextShowing: false,
				outlineText: rawToolItem.notes,
				notesHtml: buildOutlineHtml(rawToolItem.notes),
				rankHtml: 'nnn'
			})
		})
		toolItems.forEach(toolItem => {
			if (toolItem.rank === undefined) {
				toolItem.rank = 5.0;
			}
			toolItem.rankHtml = String(toolItem.rank.toFixed(1))
		})
	}
	toolItems.sort((a, b) => b.rank - a.rank);
	return toolItems;
}

function buildFlashcards(rawFlashcards: any[]): IFlashcard[] {
	const flashcards: IFlashcard[] = [];

	const buildMoreInfos = (rawMoreInfos: any): IMoreInfo[] => {
		const moreInfos: IMoreInfo[] = [];
		if (rawMoreInfos === undefined) return [];
		rawMoreInfos.forEach((rawMoreInfo: any) => {
			moreInfos.push({
				title: rawMoreInfo.title,
				url: rawMoreInfo.url
			});
		})
		return moreInfos;
	}

	if (rawFlashcards) {
		rawFlashcards.forEach(rawFlashcard => {
			flashcards.push({
				front: rawFlashcard.front,
				back: rawFlashcard.back,
				rank: rawFlashcard.rank === undefined ? 2.5 : rawFlashcard.rank,
				moreInfos: buildMoreInfos(rawFlashcard.moreInfos),
				showBack: false,
				backHtml: buildOutlineHtml(rawFlashcard.back),
				tagsArray: rawFlashcard.tags === undefined ? [] : qstr.breakIntoParts(rawFlashcard.tags, ','),
				outlineTextShowing: false,
				outlineText: rawFlashcard.back,
				idCode: qstr.forceCamelNotation(rawFlashcard.front)
			})
		})
	}
	return flashcards;
}

export const getSubmodule = (modKey: string, subKey: string): ISubmodule | null => {
	const curriculum = getCurriculum();
	const module = curriculum.modules.find(m => m.abbreviation === modKey);
	if (module !== undefined) {
		const submodule = module.submodules.find(m => m.abbreviation === subKey);
		if (submodule !== undefined) {
			return submodule;
		} else {
			return null;
		}
	} else {
		return null;
	}
};

export const getFlashcardsForSubmodule = (modKey: string, subKey: string): IFlashcard[] | null => {
	const submodule = getSubmodule(modKey, subKey);
	if (submodule !== null) {
		return submodule.flashcards;
	} else {
		return null;
	}
}

export const getToolItemsForSubmodule = (modKey: string, subKey: string): IToolItem[] | null => {
	const submodule = getSubmodule(modKey, subKey);
	if (submodule !== null) {
		return submodule.toolItems;
	} else {
		return null;
	}
}