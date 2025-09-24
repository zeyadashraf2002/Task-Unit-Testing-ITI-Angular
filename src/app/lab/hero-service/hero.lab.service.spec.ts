import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { HeroServiceForLab } from './hero.lab.service';
import { provideHttpClient } from '@angular/common/http';
import { provideZonelessChangeDetection } from '@angular/core';

describe('HeroServiceForLab HTTP Layer', () => {
  let heroService: HeroServiceForLab;
  let controller: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        HeroServiceForLab,
        provideHttpClient(),
        provideHttpClientTesting(),
        provideZonelessChangeDetection()
      ]
    });

    heroService = TestBed.inject(HeroServiceForLab);
    controller = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // نتأكد إن مفيش أي request متساب بدون تعامل
    controller.verify();
  });

  it('should load all heroes from API', () => {
    const sampleData = [
      { id: 101, name: 'Thor', strength: 95 },
      { id: 102, name: 'Hulk', strength: 150 }
    ];

    heroService.getHeroes().subscribe(result => {
      expect(result).toEqual(sampleData);
      expect(result.length).toBe(2);
    });

    const request = controller.expectOne('http://localhost:3000/heroes');
    expect(request.request.method).toBe('GET');
    request.flush(sampleData);
  });

  it('should send PUT request when updating a hero', () => {
    const updated = { id: 101, name: 'Thor Updated', strength: 120 };

    heroService.updateHero(updated).subscribe(res => {
      expect(res).toEqual(updated);
    });

    const request = controller.expectOne('http://localhost:3000/heroes');
    expect(request.request.method).toBe('PUT');
    expect(request.request.body).toEqual(updated);
    request.flush(updated);
  });
});
