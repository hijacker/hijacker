import type { HijackerRequest, HijackerResponse } from '@hijacker/core';

// TODO: Make it so that HistoryItem can be imported in other files:

export interface HistoryItem {
  requestId: string;
  hijackerRequest: HijackerRequest;
  hijackerResponse?: HijackerResponse;
}