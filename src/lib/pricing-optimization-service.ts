// =============================================================================
// AAOCAB PRICING OPTIMIZATION SERVICE
// Continuous improvement based on feedback, conversions, and competition
// =============================================================================

import { SupabaseClient } from '@supabase/supabase-js';

// =============================================================================
// TYPES
// =============================================================================

export interface PricingFeedback {
  id?: string;
  booking_id?: string;
  customer_phone?: string;
  customer_name?: string;
  route_id?: string;
  vehicle_category_id?: string;
  trip_type?: string;
  trip_date?: string;
  quoted_fare?: number;
  final_fare?: number;
  competitor_quote?: number;
  competitor_name?: string;
  overall_rating?: number;
  price_fairness_rating?: number;
  value_for_money_rating?: number;
  would_recommend?: boolean;
  feedback_type?: FeedbackType;
  feedback_text?: string;
  improvement_suggestion?: string;
  customer_action?: CustomerAction;
  feedback_source?: FeedbackSource;
}

export type FeedbackType = 
  | 'too_expensive' | 'fair_price' | 'good_value' | 'excellent_value'
  | 'hidden_charges' | 'transparent_pricing' | 'competitor_cheaper'
  | 'competitor_expensive' | 'seasonal_concern' | 'surge_complaint'
  | 'discount_request' | 'loyalty_suggestion' | 'general';

export type CustomerAction =
  | 'booked_immediately' | 'booked_later' | 'compared_then_booked'
  | 'cancelled_due_to_price' | 'chose_competitor' | 'negotiated'
  | 'used_promo_code' | 'asked_for_discount';

export type FeedbackSource =
  | 'post_trip_survey' | 'whatsapp' | 'phone_call' | 'email'
  | 'google_review' | 'social_media' | 'in_app' | 'website_form';

export interface PriceQuote {
  id?: string;
  session_id: string;
  customer_phone?: string;
  customer_ip?: string;
  device_type?: string;
  origin_city: string;
  destination_city: string;
  route_id?: string;
  vehicle_category_id?: string;
  trip_type: string;
  trip_date?: string;
  passengers?: number;
  base_fare?: number;
  per_km_rate?: number;
  distance_km?: number;
  estimated_fare?: number;
  seasonal_multiplier?: number;
  surge_multiplier?: number;
  discount_applied?: number;
  promo_code?: string;
  final_quote: number;
  ola_estimate?: number;
  uber_estimate?: number;
  savings_shown?: number;
  savings_percent?: number;
  time_spent_seconds?: number;
  compared_vehicles?: boolean;
  compared_dates?: boolean;
  viewed_breakdown?: boolean;
}

export interface PricingKPI {
  metric_date: string;
  vehicle_category_id?: string;
  route_id?: string;
  trip_type?: string;
  total_quotes: number;
  total_bookings: number;
  total_revenue: number;
  conversion_rate: number;
  avg_quote_value: number;
  avg_booking_value: number;
  avg_price_rating: number;
  price_complaints: number;
  price_compliments: number;
  pricing_health_score: number;
  optimization_opportunity: string;
}

export interface PricingInsight {
  id: string;
  insight_date: string;
  insight_type: string;
  vehicle_category_id?: string;
  route_id?: string;
  trip_type?: string;
  title: string;
  description: string;
  supporting_data?: any;
  potential_impact: string;
  estimated_revenue_impact?: number;
  confidence_score: number;
  recommended_action?: string;
  action_urgency: string;
  status: string;
}

export interface PricingRecommendation {
  category: string;
  trip_type: string;
  current_rate: number;
  recommended_rate: number;
  change_percent: number;
  reason: string;
  confidence: string;
  priority: string;
}

export interface CustomerSegment {
  customer_phone: string;
  customer_name?: string;
  total_bookings: number;
  total_spent: number;
  avg_booking_value: number;
  price_sensitivity_score: number;
  segment: string;
  uses_promo_codes: boolean;
  promo_usage_rate: number;
  pricing_strategy?: string;
  custom_discount_percent?: number;
}

export interface DashboardSummary {
  vehicle_category: string;
  trip_type: string;
  current_rate: number;
  conversion_rate: number;
  total_quotes: number;
  total_bookings: number;
  total_revenue: number;
  avg_price_rating: number;
  pricing_health_score: number;
  competitor_avg: number;
  our_advantage_percent: number;
  pending_insights: number;
  pending_adjustments: number;
  recommended_action: string;
}

// =============================================================================
// PRICING OPTIMIZATION SERVICE
// =============================================================================

export class PricingOptimizationService {
  private supabase: SupabaseClient;

  constructor(supabaseClient: SupabaseClient) {
    this.supabase = supabaseClient;
  }

  // ---------------------------------------------------------------------------
  // PRICE QUOTES (Conversion Tracking)
  // ---------------------------------------------------------------------------

  /**
   * Track a price quote shown to customer
   */
  async trackQuote(quote: PriceQuote): Promise<PriceQuote> {
    const { data, error } = await this.supabase
      .from('price_quotes')
      .insert({
        ...quote,
        quoted_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Mark a quote as converted to booking
   */
  async markQuoteConverted(quoteId: string, bookingId: string): Promise<void> {
    const { error } = await this.supabase
      .from('price_quotes')
      .update({
        converted_to_booking: true,
        booking_id: bookingId,
        converted_at: new Date().toISOString()
      })
      .eq('id', quoteId);

    if (error) throw error;
  }

  /**
   * Mark a quote as abandoned with reason
   */
  async markQuoteAbandoned(
    quoteId: string, 
    reason: string,
    timeSpentSeconds?: number
  ): Promise<void> {
    const { error } = await this.supabase
      .from('price_quotes')
      .update({
        converted_to_booking: false,
        abandonment_reason: reason,
        time_spent_seconds: timeSpentSeconds
      })
      .eq('id', quoteId);

    if (error) throw error;
  }

  /**
   * Get conversion metrics for a period
   */
  async getConversionMetrics(
    startDate: Date,
    endDate: Date,
    vehicleCategoryId?: string
  ): Promise<{
    totalQuotes: number;
    conversions: number;
    conversionRate: number;
    abandonedDueToPrice: number;
    avgQuoteValue: number;
  }> {
    let query = this.supabase
      .from('price_quotes')
      .select('*')
      .gte('quoted_at', startDate.toISOString())
      .lte('quoted_at', endDate.toISOString());

    if (vehicleCategoryId) {
      query = query.eq('vehicle_category_id', vehicleCategoryId);
    }

    const { data, error } = await query;
    if (error) throw error;

    const quotes = data || [];
    const conversions = quotes.filter(q => q.converted_to_booking).length;
    const priceAbandoned = quotes.filter(q => q.abandonment_reason === 'price_too_high').length;

    return {
      totalQuotes: quotes.length,
      conversions,
      conversionRate: quotes.length > 0 ? (conversions / quotes.length) * 100 : 0,
      abandonedDueToPrice: priceAbandoned,
      avgQuoteValue: quotes.length > 0 
        ? quotes.reduce((sum, q) => sum + (q.final_quote || 0), 0) / quotes.length 
        : 0
    };
  }

  // ---------------------------------------------------------------------------
  // CUSTOMER FEEDBACK
  // ---------------------------------------------------------------------------

  /**
   * Submit pricing feedback
   */
  async submitFeedback(feedback: PricingFeedback): Promise<PricingFeedback> {
    const { data, error } = await this.supabase
      .from('pricing_feedback')
      .insert(feedback)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Get feedback summary for a period
   */
  async getFeedbackSummary(
    startDate: Date,
    endDate: Date
  ): Promise<{
    totalFeedback: number;
    avgPriceRating: number;
    avgValueRating: number;
    complaintsCount: number;
    complimentsCount: number;
    topIssues: { type: string; count: number }[];
  }> {
    const { data, error } = await this.supabase
      .from('pricing_feedback')
      .select('*')
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString());

    if (error) throw error;

    const feedbacks = data || [];
    const withRatings = feedbacks.filter(f => f.price_fairness_rating);
    
    const complaints = feedbacks.filter(f => 
      ['too_expensive', 'hidden_charges', 'competitor_cheaper', 'surge_complaint'].includes(f.feedback_type)
    );
    
    const compliments = feedbacks.filter(f => 
      ['fair_price', 'good_value', 'excellent_value', 'transparent_pricing'].includes(f.feedback_type)
    );

    // Count by type
    const typeCounts: Record<string, number> = {};
    feedbacks.forEach(f => {
      if (f.feedback_type) {
        typeCounts[f.feedback_type] = (typeCounts[f.feedback_type] || 0) + 1;
      }
    });

    const topIssues = Object.entries(typeCounts)
      .map(([type, count]) => ({ type, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return {
      totalFeedback: feedbacks.length,
      avgPriceRating: withRatings.length > 0
        ? withRatings.reduce((sum, f) => sum + f.price_fairness_rating, 0) / withRatings.length
        : 0,
      avgValueRating: withRatings.length > 0
        ? withRatings.reduce((sum, f) => sum + (f.value_for_money_rating || 0), 0) / withRatings.length
        : 0,
      complaintsCount: complaints.length,
      complimentsCount: compliments.length,
      topIssues
    };
  }

  /**
   * Get unprocessed feedback
   */
  async getUnprocessedFeedback(limit: number = 20): Promise<PricingFeedback[]> {
    const { data, error } = await this.supabase
      .from('pricing_feedback')
      .select('*, vehicle_categories(name), routes(origin_city, destination_city)')
      .eq('is_processed', false)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  }

  /**
   * Mark feedback as processed
   */
  async markFeedbackProcessed(
    feedbackId: string, 
    processedBy: string, 
    actionTaken?: string
  ): Promise<void> {
    const { error } = await this.supabase
      .from('pricing_feedback')
      .update({
        is_processed: true,
        processed_by: processedBy,
        processed_at: new Date().toISOString(),
        action_taken: actionTaken
      })
      .eq('id', feedbackId);

    if (error) throw error;
  }

  // ---------------------------------------------------------------------------
  // PRICING KPIs
  // ---------------------------------------------------------------------------

  /**
   * Calculate daily KPIs (call from cron job)
   */
  async calculateDailyKPIs(date?: Date): Promise<number> {
    const targetDate = date || new Date(Date.now() - 86400000); // Yesterday
    const dateStr = targetDate.toISOString().split('T')[0];

    const { data, error } = await this.supabase
      .rpc('calculate_daily_kpis', { p_date: dateStr });

    if (error) throw error;
    return data || 0;
  }

  /**
   * Get KPIs for a date range
   */
  async getKPIs(
    startDate: Date, 
    endDate: Date,
    vehicleCategoryId?: string
  ): Promise<PricingKPI[]> {
    let query = this.supabase
      .from('pricing_kpis')
      .select('*, vehicle_categories(name)')
      .gte('metric_date', startDate.toISOString().split('T')[0])
      .lte('metric_date', endDate.toISOString().split('T')[0])
      .order('metric_date', { ascending: false });

    if (vehicleCategoryId) {
      query = query.eq('vehicle_category_id', vehicleCategoryId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  /**
   * Get latest KPIs
   */
  async getLatestKPIs(): Promise<PricingKPI[]> {
    const { data, error } = await this.supabase
      .from('pricing_kpis')
      .select('*, vehicle_categories(name)')
      .order('metric_date', { ascending: false })
      .limit(20);

    if (error) throw error;
    return data || [];
  }

  // ---------------------------------------------------------------------------
  // PRICING INSIGHTS
  // ---------------------------------------------------------------------------

  /**
   * Generate daily insights (call from cron job)
   */
  async generateDailyInsights(date?: Date): Promise<number> {
    const targetDate = date || new Date(Date.now() - 86400000);
    const dateStr = targetDate.toISOString().split('T')[0];

    const { data, error } = await this.supabase
      .rpc('generate_daily_insights', { p_date: dateStr });

    if (error) throw error;
    return data || 0;
  }

  /**
   * Get pending insights
   */
  async getPendingInsights(limit: number = 20): Promise<PricingInsight[]> {
    const { data, error } = await this.supabase
      .from('pricing_insights')
      .select('*, vehicle_categories(name)')
      .eq('status', 'new')
      .order('action_urgency', { ascending: true })
      .order('potential_impact', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  }

  /**
   * Get insights by type
   */
  async getInsightsByType(type: string, limit: number = 10): Promise<PricingInsight[]> {
    const { data, error } = await this.supabase
      .from('pricing_insights')
      .select('*, vehicle_categories(name)')
      .eq('insight_type', type)
      .order('insight_date', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  }

  /**
   * Update insight status
   */
  async updateInsightStatus(
    insightId: string, 
    status: string, 
    reviewedBy: string,
    notes?: string
  ): Promise<void> {
    const { error } = await this.supabase
      .from('pricing_insights')
      .update({
        status,
        reviewed_by: reviewedBy,
        reviewed_at: new Date().toISOString(),
        implementation_notes: notes,
        was_implemented: status === 'implemented'
      })
      .eq('id', insightId);

    if (error) throw error;
  }

  /**
   * Get pricing recommendations
   */
  async getRecommendations(
    vehicleCategoryId?: string, 
    tripType?: string
  ): Promise<PricingRecommendation[]> {
    const { data, error } = await this.supabase
      .rpc('get_pricing_recommendations', {
        p_vehicle_category_id: vehicleCategoryId || null,
        p_trip_type: tripType || null
      });

    if (error) throw error;
    return data || [];
  }

  // ---------------------------------------------------------------------------
  // CUSTOMER SEGMENTS
  // ---------------------------------------------------------------------------

  /**
   * Update customer segment based on behavior
   */
  async updateCustomerSegment(phone: string): Promise<CustomerSegment | null> {
    const { data, error } = await this.supabase
      .rpc('update_customer_segment', { p_phone: phone });

    if (error) throw error;
    return data;
  }

  /**
   * Get customer segment
   */
  async getCustomerSegment(phone: string): Promise<CustomerSegment | null> {
    const { data, error } = await this.supabase
      .from('customer_segments')
      .select('*')
      .eq('customer_phone', phone)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  /**
   * Get segment distribution
   */
  async getSegmentDistribution(): Promise<{
    segment: string;
    count: number;
    avgValue: number;
  }[]> {
    const { data, error } = await this.supabase
      .from('customer_segments')
      .select('segment, avg_booking_value');

    if (error) throw error;

    const segments: Record<string, { count: number; totalValue: number }> = {};
    (data || []).forEach(row => {
      if (!segments[row.segment]) {
        segments[row.segment] = { count: 0, totalValue: 0 };
      }
      segments[row.segment].count++;
      segments[row.segment].totalValue += row.avg_booking_value || 0;
    });

    return Object.entries(segments).map(([segment, stats]) => ({
      segment,
      count: stats.count,
      avgValue: stats.count > 0 ? stats.totalValue / stats.count : 0
    }));
  }

  /**
   * Get personalized discount for customer
   */
  async getPersonalizedDiscount(phone: string): Promise<number> {
    const segment = await this.getCustomerSegment(phone);
    
    if (!segment) return 0;

    // Apply discount based on segment
    switch (segment.segment) {
      case 'premium_loyal':
        return 5; // 5% loyalty discount
      case 'deal_hunter':
        return segment.discount_trigger_percent || 10;
      case 'price_sensitive':
        return 7;
      case 'value_seeker':
        return 3;
      default:
        return 0;
    }
  }

  // ---------------------------------------------------------------------------
  // DASHBOARD
  // ---------------------------------------------------------------------------

  /**
   * Get dashboard summary
   */
  async getDashboardSummary(): Promise<DashboardSummary[]> {
    const { data, error } = await this.supabase
      .from('v_pricing_dashboard')
      .select('*');

    if (error) throw error;
    return data || [];
  }

  /**
   * Get quick stats
   */
  async getQuickStats(): Promise<{
    todayQuotes: number;
    todayBookings: number;
    todayRevenue: number;
    conversionRate: number;
    avgHealthScore: number;
    pendingInsights: number;
    pendingAdjustments: number;
  }> {
    const today = new Date().toISOString().split('T')[0];

    // Get today's quotes
    const { count: quotesCount } = await this.supabase
      .from('price_quotes')
      .select('*', { count: 'exact', head: true })
      .gte('quoted_at', today);

    // Get today's bookings from quotes
    const { data: bookingsData } = await this.supabase
      .from('price_quotes')
      .select('final_quote')
      .gte('quoted_at', today)
      .eq('converted_to_booking', true);

    const bookings = bookingsData || [];
    const revenue = bookings.reduce((sum, b) => sum + (b.final_quote || 0), 0);

    // Get pending insights
    const { count: insightsCount } = await this.supabase
      .from('pricing_insights')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'new');

    // Get pending adjustments
    const { count: adjustmentsCount } = await this.supabase
      .from('pricing_adjustment_log')
      .select('*', { count: 'exact', head: true })
      .eq('approval_status', 'pending');

    // Get avg health score from yesterday
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    const { data: healthData } = await this.supabase
      .from('pricing_kpis')
      .select('pricing_health_score')
      .eq('metric_date', yesterday);

    const healthScores = (healthData || [])
      .filter(h => h.pricing_health_score)
      .map(h => h.pricing_health_score);
    const avgHealth = healthScores.length > 0
      ? healthScores.reduce((a, b) => a + b, 0) / healthScores.length
      : 0;

    return {
      todayQuotes: quotesCount || 0,
      todayBookings: bookings.length,
      todayRevenue: revenue,
      conversionRate: quotesCount ? (bookings.length / quotesCount) * 100 : 0,
      avgHealthScore: Math.round(avgHealth * 100) / 100,
      pendingInsights: insightsCount || 0,
      pendingAdjustments: adjustmentsCount || 0
    };
  }

  // ---------------------------------------------------------------------------
  // DAILY AUTOMATION
  // ---------------------------------------------------------------------------

  /**
   * Run daily optimization process
   * Call this via cron job or Supabase Edge Function
   */
  async runDailyOptimization(): Promise<{
    kpisCalculated: number;
    insightsGenerated: number;
    recommendations: PricingRecommendation[];
  }> {
    // Step 1: Calculate KPIs for yesterday
    const kpisCalculated = await this.calculateDailyKPIs();

    // Step 2: Generate insights
    const insightsGenerated = await this.generateDailyInsights();

    // Step 3: Get recommendations
    const recommendations = await this.getRecommendations();

    // Step 4: Log the learning
    await this.supabase.from('pricing_learning_log').insert({
      learning_date: new Date().toISOString().split('T')[0],
      learning_category: 'daily_analysis',
      learning_summary: `Daily analysis complete. KPIs: ${kpisCalculated}, Insights: ${insightsGenerated}, Recommendations: ${recommendations.length}`,
      detailed_findings: {
        kpis: kpisCalculated,
        insights: insightsGenerated,
        recommendations: recommendations.map(r => ({
          category: r.category,
          change: r.change_percent
        }))
      }
    });

    return {
      kpisCalculated,
      insightsGenerated,
      recommendations
    };
  }
}

// =============================================================================
// FACTORY FUNCTION
// =============================================================================

let optimizationServiceInstance: PricingOptimizationService | null = null;

export function getOptimizationService(supabase: SupabaseClient): PricingOptimizationService {
  if (!optimizationServiceInstance) {
    optimizationServiceInstance = new PricingOptimizationService(supabase);
  }
  return optimizationServiceInstance;
}

export default PricingOptimizationService;
