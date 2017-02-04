'use strict';
angular.module('nouislider', []).directive('slider', function () {
  return {
    restrict: 'A',
    scope: {
      min: '@',
      max: '@',
      step: '@',
      ngModel: '=',
      ngFrom: '=',
      ngTo: '=',
      options: '=',
      onSet: '=?'
    },
    link: function (scope, element) {
      var fromParsed, parsedValue, slider, toParsed;
      slider = element[0];
      var options = {};

      if (scope.ngFrom != null && scope.ngTo != null) {

        fromParsed = null;
        toParsed = null;

        options = angular.extend({
          start: [
            scope.ngFrom || scope.min,
            scope.ngTo || scope.max
          ],
          step: parseFloat(scope.step || 1),
          range: {
            min: [parseFloat(scope.min)],
            max: [parseFloat(scope.max)]
          },
          connect: true
        }, scope.options || {});

        noUiSlider.create(slider, options);

        slider.noUiSlider.on('update', function (values, handle) {
          return scope.$evalAsync(function () {
            if (handle == 0) {
              fromParsed = values[handle];
              scope.ngFrom = values[handle];
            }
            else {
              toParsed = values[handle];
              scope.ngTo = values[handle];
            }
          });
        });

        slider.noUiSlider.on('set', function (values, handle) {
          return scope.$evalAsync(function () {
            if (scope.onSet)
              scope.onSet(values, handle);
          });
        });

        scope.$watch('ngFrom', function (newVal) {
          if (newVal !== fromParsed) {
            slider.noUiSlider.set([newVal, null]);
          }
        });
        return scope.$watch('ngTo', function (newVal) {
          if (newVal !== toParsed) {
            slider.noUiSlider.set([null, newVal]);
          }
        });
      }
      else {

        parsedValue = null;

        options = angular.extend({
          start: scope.ngModel ? scope.ngModel : [scope.min],
          step: parseFloat(scope.step || 1),
          range: {
            min: [parseFloat(scope.min)],
            max: [parseFloat(scope.max)]
          }
        }, scope.options || {});

        noUiSlider.create(slider, options);

        slider.noUiSlider.on('update', function (values, handle) {
          return scope.$evalAsync(function () {
            parsedValue = values[handle];
            scope.ngModel = parsedValue;
          });
        });

        slider.noUiSlider.on('set', function (values, handle) {
          return scope.$evalAsync(function () {
            if (scope.onSet)
              scope.onSet(values, handle);
          });
        });

        return scope.$watch('ngModel', function (newVal) {
          if (newVal !== parsedValue) {
            return slider.noUiSlider.set(newVal);
          }
        });
      }
    }
  };
});

