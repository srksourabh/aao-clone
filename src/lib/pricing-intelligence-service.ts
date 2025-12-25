// =============================================================================
// AAOCAB PRICING INTELLIGENCE - TypeScript Types & Service
// =============================================================================

import { createClient, SupabaseClient } from '@supabase/supabase-js';

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

export interface Competitor {
  id: string;
  name: string;
  code: string;
  website?: string;
  api_available: boolean;
  is_active: boolean;
  market_position: 'premium' | 'mid-range' | 'budget' | 'value';
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface VehicleCategory {
  id: string;
  name: string;
  code: string;
  description?: string;
  seating_capacity: number;
  luggage_capacity?: number;
  is_ac: boolean;
  sort_order: number;
  created_at: string;
}

export interface Route {
  id: string;
  origin_city: string;
  origin_state: string;
  destination_city: string;
  destination_state: string;
  distance_km: number;
  typical_duration_hours?: number;
  is_popular: boolean;
  highway_name?: string;
  toll_count: number;
  estimated_toll_amount: number;
  created_at: string;
  updated_at: string;
}

export interface CompetitorPricing {
  id: string;
  competitor_id: string;
  vehicle_category_id: string;
  route_id?: string;
  trip_type: 'one_way' | 'round_trip' | 'rental' | 'package';
  per_km_rate?: number;
  base_fare?: number;
  total_fare?: number;
  driver_allowance_per_day: number;
  night_charge_multiplier: number;
  toll_included: boolean;
  tax_included: boolean;
  min_km_per_day: number;
  min_hours_per_day: number;
  extra_km_rate?: number;
  extra_hour_rate?: number;
  waiting_charge_per_min?: number;
  data_source?: string;
  source_url?: string;
  captured_at: string;
  valid_from: string;
  valid_until?: string;
  is_promotional: boolean;
  promo_code?: string;
  created_at: string;
  updated_at: string;
}

export interface PricingFactor {
  id: string;
  factor_date: string;
  route_id?: string;
  season?: 'summer' | 'monsoon' | 'autumn' | 'winter' | 'spring';
  is_peak_season: boolean;
  is_festival: boolean;
  festival_name?: string;
  weather_condition?: 'clear' | 'cloudy' | 'light_rain' | 'heavy_rain' | 'fog' | 'storm';
  temperature_celsius?: number;
  demand_level?: 'very_low' | 'low' | 'normal' | 'high' | 'very_high' | 'surge';
  demand_multiplier: number;
  petrol_price?: number;
  diesel_price?: number;
  cng_price?: number;
  day_of_week: number;
  is_weekend: boolean;
  is_holiday: boolean;
  holiday_name?: string;
  has_major_event: boolean;
  event_name?: string;
  event_type?: string;
  created_at: string;
  updated_at: string;
}

export interface AaocabPricing {
  id: string;
  vehicle_category_id: string;
  route_id?: string;
  trip_type: 'one_way' | 'round_trip' | 'rental' | 'package';
  per_km_rate: number;
  base_fare: number;
  min_km_per_day: number;
  min_hours_per_day: number;
  extra_km_rate?: number;
  extra_hour_rate?: number;
  waiting_charge_per_min: number;
  driver_allowance_included: boolean;
  toll_included: boolean;
  tax_included: boolean;
  night_charges_included: boolean;
  night_charge_multiplier: number;
  night_start_hour: number;
  night_end_hour: number;
  enable_dynamic_pricing: boolean;
  max_surge_multiplier: number;
  min_discount_multiplier: number;
  target_position?: 'cheapest' | 'below_average' | 'average' | 'above_average' | 'premium';
  competitor_discount_percent: number;
  is_active: boolean;
  valid_from: string;
  valid_until?: string;
  created_at: string;
  updated_at: string;
}

export interface PriceComparisonHistory {
  id: string;
  comparison_date: string;
  route_id?: string;
  vehicle_category_id: string;
  trip_type: string;
  aaocab_per_km?: number;
  aaocab_total?: number;
  competitor_avg_per_km?: number;
  competitor_min_per_km?: number;
  competitor_max_per_km?: number;
  cheapest_competitor?: string;
  most_expensive_competitor?: string;
  our_position_rank?: number;
  total_competitors?: number;
  percent_below_avg?: number;
  percent_below_max?: number;
  recommended_action?: 'maintain' | 'increase' | 'decrease' | 'aggressive_discount' | 'premium_increase';
  recommended_per_km?: number;
  created_at: string;
}

export interface PricingAdjustmentLog {
  id: string;
  adjustment_date: string;
  aaocab_pricing_id?: string;
  vehicle_category_id?: string;
  route_id?: string;
  trip_type?: string;
  old_per_km_rate?: number;
  old_base_fare?: number;
  new_per_km_rate?: number;
  new_base_fare?: number;
  change_percent?: number;
  change_reason?: string;
  trigger_type?: 'automatic' | 'manual' | 'competitor_change' | 'seasonal' | 'demand' | 'fuel_price';
  approved_by?: string;
  approval_status?: 'pending' | 'approved' | 'rejected' | 'auto_approved';
  approved_at?: string;
  notes?: string;
  created_at: string;
}

export interface SeasonalPricingRule {
  id: string;
  name: string;
  description?: string;
  start_month?: number;
  end_month?: number;
  specific_dates?: string[];
  route_id?: string;
  applies_to_all_routes: boolean;
  price_multiplier: number;
  min_multiplier: number;
  max_multiplier: number;
  priority: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PriceMonitoringSchedule {
  id: string;
  competitor_id: string;
  frequency_days: number;
  last_checked_at?: string;
  next_check_at?: string;
  is_active: boolean;
  check_method?: 'manual' | 'api' | 'web_scrape' | 'email_alert';
  last_check_status?: 'success' | 'failed' | 'partial' | 'pending';
  last_check_notes?: string;
  consecutive_failures: number;
  created_at: string;
  updated_at: string;
}

// Dashboard types
export interface PricingDashboardMetric {
  metric_name: string;
  metric_value: string;
  trend: string;
  last_updated: string;
}

export interface PriceComparisonView {
  vehicle_category: string;
  category_code: string;
  trip_type: string;
  aaocab_rate: number;
  competitor_avg: number;
  competitor_min: number;
  competitor_max: number;
  diff_from_avg: number;
  savings_percent: number;
  current_seasonal_multiplier: number;
  last_price_update: string;
}

export interface RecommendedPrice {
  avg_competitor_rate: number;
  min_competitor_rate: number;
  max_competitor_rate: number;
  recommended_rate: number;
  current_aaocab_rate: number;
  price_difference: number;
  recommendation: string;
}

// =============================================================================
// PRICING INTELLIGENCE SERVICE
// =============================================================================

export class PricingIntelligenceService {
  private supabase: SupabaseClient;

  constructor(supabaseUrl: string, supabaseKey: string) {
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  // ---------------------------------------------------------------------------
  // COMPETITORS
  // ---------------------------------------------------------------------------

  async getCompetitors(): Promise<Competitor[]> {
    const { data, error } = await this.supabase
      .from('competitors')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return data || [];
  }

  async getActiveCompetitors(): Promise<Competitor[]> {
    const { data, error } = await this.supabase
      .from('competitors')
      .select('*')
      .eq('is_active', true)
      .order('name');
    
    if (error) throw error;
    return data || [];
  }

  async addCompetitor(competitor: Partial<Competitor>): Promise<Competitor> {
    const { data, error } = await this.supabase
      .from('competitors')
      .insert(competitor)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // ---------------------------------------------------------------------------
  // VEHICLE CATEGORIES
  // ---------------------------------------------------------------------------

  async getVehicleCategories(): Promise<VehicleCategory[]> {
    const { data, error } = await this.supabase
      .from('vehicle_categories')
      .select('*')
      .order('sort_order');
    
    if (error) throw error;
    return data || [];
  }

  // ---------------------------------------------------------------------------
  // ROUTES
  // ---------------------------------------------------------------------------

  async getRoutes(): Promise<Route[]> {
    const { data, error } = await this.supabase
      .from('routes')
      .select('*')
      .order('origin_city');
    
    if (error) throw error;
    return data || [];
  }

  async getPopularRoutes(): Promise<Route[]> {
    const { data, error } = await this.supabase
      .from('routes')
      .select('*')
      .eq('is_popular', true)
      .order('origin_city');
    
    if (error) throw error;
    return data || [];
  }

  async addRoute(route: Partial<Route>): Promise<Route> {
    const { data, error } = await this.supabase
      .from('routes')
      .insert(route)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // ---------------------------------------------------------------------------
  // COMPETITOR PRICING
  // ---------------------------------------------------------------------------

  async getCompetitorPricing(
    competitorId?: string, 
    vehicleCategoryId?: string, 
    tripType?: string
  ): Promise<CompetitorPricing[]> {
    let query = this.supabase
      .from('competitor_pricing')
      .select('*, competitors(name, code), vehicle_categories(name, code)')
      .order('captured_at', { ascending: false });
    
    if (competitorId) query = query.eq('competitor_id', competitorId);
    if (vehicleCategoryId) query = query.eq('vehicle_category_id', vehicleCategoryId);
    if (tripType) query = query.eq('trip_type', tripType);
    
    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  async addCompetitorPricing(pricing: Partial<CompetitorPricing>): Promise<CompetitorPricing> {
    const { data, error } = await this.supabase
      .from('competitor_pricing')
      .insert({
        ...pricing,
        captured_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async bulkAddCompetitorPricing(pricingList: Partial<CompetitorPricing>[]): Promise<CompetitorPricing[]> {
    const pricingWithTimestamp = pricingList.map(p => ({
      ...p,
      captured_at: new Date().toISOString()
    }));

    const { data, error } = await this.supabase
      .from('competitor_pricing')
      .insert(pricingWithTimestamp)
      .select();
    
    if (error) throw error;
    return data || [];
  }

  // ---------------------------------------------------------------------------
  // AAOCAB PRICING
  // ---------------------------------------------------------------------------

  async getAaocabPricing(vehicleCategoryId?: string, tripType?: string): Promise<AaocabPricing[]> {
    let query = this.supabase
      .from('aaocab_pricing')
      .select('*, vehicle_categories(name, code)')
      .eq('is_active', true)
      .order('vehicle_category_id');
    
    if (vehicleCategoryId) query = query.eq('vehicle_category_id', vehicleCategoryId);
    if (tripType) query = query.eq('trip_type', tripType);
    
    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  async updateAaocabPricing(id: string, updates: Partial<AaocabPricing>): Promise<AaocabPricing> {
    const { data, error } = await this.supabase
      .from('aaocab_pricing')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // ---------------------------------------------------------------------------
  // SEASONAL PRICING RULES
  // ---------------------------------------------------------------------------

  async getSeasonalRules(): Promise<SeasonalPricingRule[]> {
    const { data, error } = await this.supabase
      .from('seasonal_pricing_rules')
      .select('*')
      .eq('is_active', true)
      .order('priority', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  async addSeasonalRule(rule: Partial<SeasonalPricingRule>): Promise<SeasonalPricingRule> {
    const { data, error } = await this.supabase
      .from('seasonal_pricing_rules')
      .insert(rule)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // ---------------------------------------------------------------------------
  // MONITORING SCHEDULE
  // ---------------------------------------------------------------------------

  async getMonitoringSchedule(): Promise<PriceMonitoringSchedule[]> {
    const { data, error } = await this.supabase
      .from('price_monitoring_schedule')
      .select('*, competitors(name, code)')
      .order('next_check_at');
    
    if (error) throw error;
    return data || [];
  }

  async getDueChecks(): Promise<PriceMonitoringSchedule[]> {
    const { data, error } = await this.supabase
      .from('price_monitoring_schedule')
      .select('*, competitors(name, code)')
      .eq('is_active', true)
      .lte('next_check_at', new Date().toISOString())
      .order('next_check_at');
    
    if (error) throw error;
    return data || [];
  }

  async markCheckComplete(
    scheduleId: string, 
    status: 'success' | 'failed' | 'partial',
    notes?: string
  ): Promise<void> {
    const nextCheck = new Date();
    nextCheck.setDate(nextCheck.getDate() + 7); // Next check in 7 days

    const { error } = await this.supabase
      .from('price_monitoring_schedule')
      .update({
        last_checked_at: new Date().toISOString(),
        next_check_at: nextCheck.toISOString(),
        last_check_status: status,
        last_check_notes: notes,
        consecutive_failures: status === 'failed' ? this.supabase.rpc('increment_failures', { row_id: scheduleId }) : 0
      })
      .eq('id', scheduleId);
    
    if (error) throw error;
  }

  // ---------------------------------------------------------------------------
  // PRICE COMPARISON & ANALYTICS
  // ---------------------------------------------------------------------------

  async getPriceComparisonView(): Promise<PriceComparisonView[]> {
    const { data, error } = await this.supabase
      .from('v_current_price_comparison')
      .select('*');
    
    if (error) throw error;
    return data || [];
  }

  async getRecommendedPrice(
    vehicleCategoryId: string, 
    tripType: string, 
    routeId?: string
  ): Promise<RecommendedPrice | null> {
    const { data, error } = await this.supabase
      .rpc('calculate_recommended_price', {
        p_vehicle_category_id: vehicleCategoryId,
        p_trip_type: tripType,
        p_route_id: routeId || null
      });
    
    if (error) throw error;
    return data?.[0] || null;
  }

  async getSeasonalMultiplier(date?: Date, routeId?: string): Promise<number> {
    const { data, error } = await this.supabase
      .rpc('get_seasonal_multiplier', {
        p_date: (date || new Date()).toISOString().split('T')[0],
        p_route_id: routeId || null
      });
    
    if (error) throw error;
    return data || 1.0;
  }

  async getDashboardMetrics(): Promise<PricingDashboardMetric[]> {
    const { data, error } = await this.supabase
      .rpc('get_pricing_dashboard');
    
    if (error) throw error;
    return data || [];
  }

  async triggerAutoAdjustment(): Promise<PricingAdjustmentLog[]> {
    const { data, error } = await this.supabase
      .rpc('auto_adjust_prices');
    
    if (error) throw error;
    return data || [];
  }

  // ---------------------------------------------------------------------------
  // ADJUSTMENT LOG
  // ---------------------------------------------------------------------------

  async getPendingAdjustments(): Promise<PricingAdjustmentLog[]> {
    const { data, error } = await this.supabase
      .from('pricing_adjustment_log')
      .select('*, vehicle_categories(name)')
      .eq('approval_status', 'pending')
      .order('adjustment_date', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  async approveAdjustment(adjustmentId: string, approvedBy: string): Promise<void> {
    // Get the adjustment details
    const { data: adjustment, error: fetchError } = await this.supabase
      .from('pricing_adjustment_log')
      .select('*')
      .eq('id', adjustmentId)
      .single();
    
    if (fetchError) throw fetchError;
    if (!adjustment) throw new Error('Adjustment not found');

    // Apply the new price
    if (adjustment.aaocab_pricing_id) {
      await this.supabase
        .from('aaocab_pricing')
        .update({
          per_km_rate: adjustment.new_per_km_rate,
          base_fare: adjustment.new_base_fare || 0
        })
        .eq('id', adjustment.aaocab_pricing_id);
    }

    // Mark as approved
    const { error } = await this.supabase
      .from('pricing_adjustment_log')
      .update({
        approval_status: 'approved',
        approved_by: approvedBy,
        approved_at: new Date().toISOString()
      })
      .eq('id', adjustmentId);
    
    if (error) throw error;
  }

  async rejectAdjustment(adjustmentId: string, rejectedBy: string, reason?: string): Promise<void> {
    const { error } = await this.supabase
      .from('pricing_adjustment_log')
      .update({
        approval_status: 'rejected',
        approved_by: rejectedBy,
        approved_at: new Date().toISOString(),
        notes: reason
      })
      .eq('id', adjustmentId);
    
    if (error) throw error;
  }

  // ---------------------------------------------------------------------------
  // HISTORY
  // ---------------------------------------------------------------------------

  async getPriceHistory(
    vehicleCategoryId?: string, 
    days: number = 90
  ): Promise<PriceComparisonHistory[]> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    let query = this.supabase
      .from('price_comparison_history')
      .select('*, vehicle_categories(name)')
      .gte('comparison_date', startDate.toISOString().split('T')[0])
      .order('comparison_date', { ascending: false });
    
    if (vehicleCategoryId) {
      query = query.eq('vehicle_category_id', vehicleCategoryId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  // ---------------------------------------------------------------------------
  // FARE CALCULATOR (for customer-facing)
  // ---------------------------------------------------------------------------

  async calculateFare(
    originCity: string,
    destinationCity: string,
    vehicleCategoryCode: string,
    tripType: 'one_way' | 'round_trip',
    tripDate?: Date
  ): Promise<{
    baseFare: number;
    perKmRate: number;
    distanceKm: number;
    estimatedFare: number;
    tollCharges: number;
    seasonalMultiplier: number;
    totalFare: number;
    inclusions: string[];
  } | null> {
    // Get route info
    const { data: route } = await this.supabase
      .from('routes')
      .select('*')
      .eq('origin_city', originCity)
      .eq('destination_city', destinationCity)
      .single();

    if (!route) return null;

    // Get pricing
    const { data: pricing } = await this.supabase
      .from('aaocab_pricing')
      .select('*, vehicle_categories!inner(code)')
      .eq('vehicle_categories.code', vehicleCategoryCode)
      .eq('trip_type', tripType)
      .eq('is_active', true)
      .is('route_id', null)
      .single();

    if (!pricing) return null;

    // Get seasonal multiplier
    const seasonalMultiplier = await this.getSeasonalMultiplier(tripDate, route.id);

    // Calculate fares
    const distanceKm = tripType === 'round_trip' ? route.distance_km * 2 : route.distance_km;
    const minKm = Math.max(distanceKm, pricing.min_km_per_day);
    const baseFare = pricing.base_fare || 0;
    const kmFare = minKm * pricing.per_km_rate;
    const estimatedFare = baseFare + kmFare;
    const seasonalFare = estimatedFare * seasonalMultiplier;
    const tollCharges = pricing.toll_included ? 0 : (tripType === 'round_trip' ? route.estimated_toll_amount * 2 : route.estimated_toll_amount);

    const inclusions = [];
    if (pricing.driver_allowance_included) inclusions.push('Driver allowance');
    if (pricing.toll_included) inclusions.push('Toll charges');
    if (pricing.tax_included) inclusions.push('GST');

    return {
      baseFare,
      perKmRate: pricing.per_km_rate,
      distanceKm: minKm,
      estimatedFare: seasonalFare,
      tollCharges,
      seasonalMultiplier,
      totalFare: Math.round(seasonalFare + tollCharges),
      inclusions
    };
  }
}

// =============================================================================
// SINGLETON INSTANCE
// =============================================================================

let pricingServiceInstance: PricingIntelligenceService | null = null;

export function getPricingService(): PricingIntelligenceService {
  if (!pricingServiceInstance) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase credentials not configured');
    }
    
    pricingServiceInstance = new PricingIntelligenceService(supabaseUrl, supabaseKey);
  }
  return pricingServiceInstance;
}

export default PricingIntelligenceService;
