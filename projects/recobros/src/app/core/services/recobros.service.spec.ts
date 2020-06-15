import { TestBed } from "@angular/core/testing";

import { RecobrosService } from "./recobros.service";

describe("RecobrosService", () => {
  let service: RecobrosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RecobrosService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
