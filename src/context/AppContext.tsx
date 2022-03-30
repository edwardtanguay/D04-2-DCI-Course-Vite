import { createContext, useState, useEffect, ReactNode } from 'react';
import { IFlashcard, IToolItem } from '../models/interfaces';
import { getFlashcardsForSubmodule, getToolItemsForSubmodule } from '../models/model_curriculum';

export type AppContent = {
	ASM: any
}

const AppContext = createContext<AppContent>({
	ASM: () => {}
});
const localStorageIdCode = 'courseSiteD042AppState';

const initialAppState = JSON.parse(localStorage.getItem(localStorageIdCode) || '{}');
export const AppProvider = ({ children }: { children: ReactNode }) => {
	const [appState, setAppState] = useState<any>(initialAppState);
	useEffect(() => {
		localStorage.setItem(localStorageIdCode, JSON.stringify(appState));
	}, [appState]);

	class ASM {

		// GENERAL

		static save = () => {
			setAppState({ ...appState });
		}

		// FLASHCARDS

		static markFlashcard = (modKey: string, subKey: string, flashcard: IFlashcard) => {
			ASM.forceFlashcards(modKey, subKey);
			appState[modKey][subKey].flashcardIdCodes.push(flashcard.idCode);
		}

		static unmarkFlashcard = (modKey: string, subKey: string, flashcard: IFlashcard) => {
			ASM.forceFlashcards(modKey, subKey);
			const index = appState[modKey][subKey].flashcardIdCodes.indexOf(flashcard.idCode);
			appState[modKey][subKey].flashcardIdCodes.splice(index, 1);
		}

		static forceFlashcards = (modKey: string, subKey: string) => {
			if (!appState[modKey]) {
				appState[modKey] = {};
			}
			if (!appState[modKey][subKey]) {
				appState[modKey][subKey] = {};
			}
			if (!appState[modKey][subKey].flashcardIdCodes) {
				appState[modKey][subKey].flashcardIdCodes = [];
				ASM.save();
			}
		}

		static toggleFlashcardMarked = (modKey: string, subKey: string, flashcard: IFlashcard) => {
			ASM.forceFlashcards(modKey, subKey);
			if (!ASM.flashcardIsMarked(modKey, subKey, flashcard)) {
				ASM.markFlashcard(modKey, subKey, flashcard);
			} else {
				ASM.unmarkFlashcard(modKey, subKey, flashcard);
			}
			ASM.save();
		}

		static flashcardIsMarked = (modKey: string, subKey: string, flashcard: IFlashcard) => {
			ASM.forceFlashcards(modKey, subKey);
			return appState[modKey][subKey].flashcardIdCodes.find((m: string) => m === flashcard.idCode) !== undefined;
		}

		static getNumberOfMarkedFlashcards = (modKey: string, subKey: string) => {
			ASM.forceFlashcards(modKey, subKey);
			return appState[modKey][subKey].flashcardIdCodes.length;
		}

		static getFlashcardsInfoForSubmodule = (modKey: string, subKey: string) => {
			const obj = {
				total: 0,
				marked: 0,
				unmarked: 0
			};
			const flashcards = getFlashcardsForSubmodule(modKey, subKey);
			if (flashcards !== null) {
				obj.total = flashcards.length;
				flashcards.forEach(flashcard => {
					if (ASM.flashcardIsMarked(modKey, subKey, flashcard)) {
						obj.marked++;
					} else {
						obj.unmarked++;
					}
				})
			}
			return obj;
		}

		// TOOL ITEMS

		// TODO: refactor mod/sub here in each
		static forceToolItems = (modKey: string, subKey: string) => {
			if (!appState[modKey]) {
				appState[modKey] = {};
			}
			if (!appState[modKey][subKey]) {
				appState[modKey][subKey] = {};
			}
			if (!appState[modKey][subKey].toolItemIdCodes) {
				appState[modKey][subKey].toolItemIdCodes = [];
				ASM.save();
			}
		}

		static markToolItem = (modKey: string, subKey: string, toolItem: IToolItem) => {
			ASM.forceToolItems(modKey, subKey);
			appState[modKey][subKey].toolItemIdCodes.push(toolItem.idCode);
		}

		static getNumberOfMarkedToolItems = (modKey: string, subKey: string) => {
			ASM.forceToolItems(modKey, subKey);
			return appState[modKey][subKey].toolItemIdCodes.length;
		}

		static unmarkToolItem = (modKey: string, subKey: string, toolItem: IToolItem) => {
			ASM.forceToolItems(modKey, subKey);
			const index = appState[modKey][subKey].toolItemIdCodes.indexOf(toolItem.idCode);
			appState[modKey][subKey].toolItemIdCodes.splice(index, 1);
		}

		static toggleToolItemMarked = (modKey: string, subKey: string, toolItem: IToolItem) => {
			ASM.forceFlashcards(modKey, subKey);
			if (!ASM.toolItemIsMarked(modKey, subKey, toolItem)) {
				ASM.markToolItem(modKey, subKey, toolItem);
			} else {
				ASM.unmarkToolItem(modKey, subKey, toolItem);
			}
			ASM.save();
		}

		
		static toolItemIsMarked = (modKey: string, subKey: string, toolItem: IToolItem) => {
			ASM.forceToolItems(modKey, subKey);
			return appState[modKey][subKey].toolItemIdCodes.find((m: string) => m === toolItem.idCode) !== undefined;
		}


		static getToolItemsInfoForSubmodule = (modKey: string, subKey: string) => {
			const obj = {
				total: 0,
				marked: 0,
				unmarked: 0
			};
			const toolItems = getToolItemsForSubmodule(modKey, subKey);
			if (toolItems !== null) {
				obj.total = toolItems.length;
				toolItems.forEach(toolItem => {
					if (ASM.toolItemIsMarked(modKey, subKey, toolItem)) {
						obj.marked++;
					} else {
						obj.unmarked++;
					}
				})
			}
			return obj;
		}
	}

	return (
		<AppContext.Provider value={{ ASM, }}>
			{children}
		</AppContext.Provider>
	);
};

export default AppContext;
