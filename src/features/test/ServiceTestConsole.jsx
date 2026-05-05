import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { authService } from '@/api/authService';
import { userService } from '@/api/userService';
import { dishService } from '@/api/dishService';
import { mealService } from '@/api/mealService';
import { adminService } from '@/api/adminService';
import { ingredientService } from '@/api/ingredientService';

export default function ServiceTestConsole() {
  const [results, setResults] = useState([]);

  const log = (label, data, error) => {
    setResults((prev) => [
      { time: new Date().toLocaleTimeString(), label, data, error },
      ...prev.slice(0, 49),
    ]);
  };

  const runTest = async (label, fn) => {
    try {
      const data = await fn();
      log(label, data, null);
    } catch (err) {
      log(label, null, err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold">Service Test Console (Phase 1)</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Button onClick={() => runTest('Auth: getUserAccount', () => authService.getUserAccount())}>Auth: getUser</Button>
        <Button onClick={() => runTest('User: getProfile', () => userService.getProfile())}>User: getProfile</Button>
        <Button onClick={() => runTest('User: getHealthGoal', () => userService.getHealthGoal())}>User: getHealthGoal</Button>
        <Button onClick={() => runTest('User: getFavorites', () => userService.getFavorites())}>User: getFavorites</Button>
        <Button onClick={() => runTest('Dish: getDishes', () => dishService.getDishes())}>Dish: getDishes</Button>
        <Button onClick={() => runTest('Dish: getCategories', () => dishService.getCategories())}>Dish: getCategories</Button>
        <Button onClick={() => runTest('Meal: getMealPlans', () => mealService.getMealPlans())}>Meal: getMealPlans</Button>
        <Button onClick={() => runTest('Meal: getTemplates', () => mealService.getTemplates())}>Meal: getTemplates</Button>
        <Button onClick={() => runTest('Ingredient: getIngredients', () => ingredientService.getIngredients())}>Ing: getIngredients</Button>
        <Button onClick={() => runTest('Admin: getStats', () => adminService.getStats())}>Admin: getStats</Button>
        <Button onClick={() => runTest('Admin: getAllUsers', () => adminService.getAllUsers())}>Admin: getAllUsers</Button>
        <Button onClick={() => runTest('Admin: getFeedbacks', () => adminService.getFeedbacks())}>Admin: getFeedbacks</Button>
      </div>

      <div className="space-y-2 max-h-[500px] overflow-y-auto">
        {results.map((r, i) => (
          <Card key={i} className={r.error ? 'border-red-300 bg-red-50' : 'border-green-300 bg-green-50'}>
            <CardHeader className="py-2">
              <CardTitle className="text-sm font-medium">
                [{r.time}] {r.label} {r.error ? '❌' : '✅'}
              </CardTitle>
            </CardHeader>
            {r.error && (
              <CardContent className="py-2 text-sm text-red-700">{r.error}</CardContent>
            )}
            {r.data && (
              <CardContent className="py-2 text-sm text-green-800">
                <pre className="whitespace-pre-wrap overflow-x-auto">{JSON.stringify(r.data, null, 2)}</pre>
              </CardContent>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
