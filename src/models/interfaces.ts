export {};

export interface IVideo {
	description: string;
	url: string;
	extra: string;
}

export interface ITopic {
	title: string;
	url: string;
	notes: string[];
}

export enum ActivityCurriculumStatus {
	raw,
	repositoryExerciseCreated,
	released,
	cancelled
}

export interface IActivity {
	kind: string;
	url: string;
	rank: number;
	topics: ITopic[];
	description: string;
	exerciseNumber: string;
	imagePathAndFileName: string;
	status: IActivityStatus;
	exerciseSymbol: string;
	dciExerciseUrl: string;
	dciSolutionUrl: string;
	rawTopics: string;
	time: string;
	curriculumStatus: ActivityCurriculumStatus
	released: boolean;
	exerciseCode: string;
	dciActivityCode: string; // e.g. Browser-modules-basics
	dciActivityTitle: string; // e.g. Browser Modules Basics
	displayKind: string;
	title: string;
	cancelled: boolean;
	cancelledReason: string;
	createExerciseUrl: string;
	readmeCopyText: string;
	outlineHtml: string;
	outlineCopyTextShowing: boolean;
	outlineCopyText: string;
	adminMessage: string;
	preliveCode: string;
}

export enum TimeStatus {
	past,
	today,
	future
}

export interface IExerciseStatusItem {
	exerciseNumber: string;
	numberFinished: number;
	numberUnfinished: number;
}

export interface IDay {
	submoduleAbbreviation: string;
	date: string;
	activities: IActivity[];
	videos: IVideo[];
	collapsed: boolean;
	title: string;
	timeStatus: string;
	exerciseStatusItems: IExerciseStatusItem[];
	courseBookCopyText: string;
	bulkTopics: string;
	kind: string;
	[x: string]: any; // allow any other field, e.g. "extras"
}

export interface ISubmodule {
	title: string;
	objectives: string[];
	overviewCollapsed: boolean;
	objectivesCollapsed: boolean;
	resourcesCollapsed: boolean;
	flashcardsCollapsed: boolean;
	days: IDay[];
	collapsed: boolean;
	abbreviation: string;
	resources: IResource[];
	overview: string;
	flashcards: IFlashcard[];
	totalDays: number;
	taskItemsCollapsed: boolean;
	taskItems: ITaskItem[];
	toolItemsCollapsed: boolean;
	toolItems: IToolItem[];
}

export interface IModule {
	title: string;
	abbreviation: string;
	submodules: ISubmodule[];
}

export interface ICurriculum {
	className: string;
	modules: IModule[];
	adminAccess: boolean;
	lastExerciseNumber: number;
}

export interface IResource {
	title: string;
	url: string;
	notes: string[];
	rank: number;
	iconFileName: string;
	time: string;
}

export interface IMoreInfo {
	title: string;
	url: string;
}

export interface IActivityStatus {
	finished: string;
	unfinished: string;
	numberFinished: number;
	numberUnfinished: number;
}

export interface IFlashcard {
	front: string;
	back: string;
	tagsArray: string[];
	rank: number;
	moreInfos: IMoreInfo[];
	showBack: boolean;
	backHtml: string;
	outlineTextShowing: boolean;
	outlineText: string;
	idCode: string;
}

export interface IToolItem {
	title: string;
	kind: string;
	notes: string;
	rank: number;
	idCode: string;
	showNotes: boolean;
	outlineTextShowing: boolean;
	outlineText: string;
	notesHtml: string;
	rankHtml: string;
}

export interface ITaskItem {
	title: string;
	tagsArray: string[];
	difficulty: number;
	timeInMinutes: number;
	instructionOrder: number;
}