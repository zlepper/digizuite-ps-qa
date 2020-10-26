import { CustomerEnvironment } from '../store/customer/customer.interfaces';
import { Product, ProductUseCase } from '../store/product/product.interfaces';
import { Test, TestResult } from '../store/test/test.interfaces';
import { Version } from './version';
import { Dictionary } from '@ngrx/entity';

export function getUseCasesForProductVersion(useCases: ProductUseCase[], productVersion: string): ProductUseCase[] {
  const selectedVersion = new Version(productVersion);

  const matchingCases = useCases.filter(uc => {
    if (uc.fromVersion) {
      const fw = new Version(uc.fromVersion);

      if (fw.greaterThan(selectedVersion)) {
        return false;
      }
    }

    if (uc.toVersion) {
      const tw = new Version(uc.toVersion);

      if (tw.lessThan(selectedVersion)) {
        return false;
      }
    }

    return true;
  });

  return matchingCases;
}

export function getTestsFromProductUseCases(
  useCases: ProductUseCase[],
  customerId: string,
  environmentId: string,
  testDict: Dictionary<Test>,
): Test[] {
  if (useCases.length === 0) {
    return [];
  }

  const productId = useCases[0].productId;

  const idPrefix = `${customerId}:${environmentId}:${productId}:`;

  return useCases.map(uc => {
    const id = idPrefix + uc.id;

    return (
      testDict[id] ?? {
        id,
        result: TestResult.notRun,
        customerId,
        environmentId,
        productId,
        useCaseId: uc.id,
      }
    );
  });
}
