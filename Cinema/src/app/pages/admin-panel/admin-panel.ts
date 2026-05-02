import { Component } from '@angular/core';
import { ChartConfiguration, ChartData, ChartType, Chart, registerables } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { StatCard } from "../../components/stat-card/stat-card";
import { RouterLink } from "@angular/router";

Chart.register(...registerables);

@Component({
  selector: 'app-admin-panel',
  imports: [StatCard, BaseChartDirective],
  templateUrl: './admin-panel.html',
  styleUrl: './admin-panel.css',
})
export class AdminPanel {
  // Chart configuration
  public doughnutChartLabels: string[] = ['Mobile', 'Web', 'Kiosk'];
  public doughnutChartData: ChartData<'doughnut'> = {
    labels: this.doughnutChartLabels,
    datasets: [
      {
        data: [45, 40, 15],
        backgroundColor: ['#AA6178', '#713247', '#3B061C'],
        hoverBackgroundColor: ['#C87A91', '#551C31', '#2D0412'],
        borderWidth: 0,
      }
    ]
  };
  public doughnutChartType: 'doughnut' = 'doughnut';
  public doughnutChartOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        enabled: true,
        backgroundColor: 'rgba(59, 6, 28, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        padding: 10,
        displayColors: false
      }
    },
    cutout: '75%'
  };

  cardsStats: StatCard[] = [
    {
      iconUrl: '/money.svg',
      stat: 'TOTAL REVENUE',
      statNumber: '$124,592',
      statAmount: '+12.5% vs last month',
      upOrDownIconUrl: "/upArrow.svg"
    },
    {
      iconUrl: '/ticket.svg',
      stat: 'BOOKINGS TODAY',
      statNumber: '842',
      statAmount: '+5.2% vs yesterday',
      upOrDownIconUrl: "/upArrow.svg"
    },
    {
      iconUrl: '/user.svg',
      stat: 'ACTIVE USERS',
      statNumber: '3,201',
      statAmount: '-0.8% vs last week',
      upOrDownIconUrl: "/downArrow.svg"
    },
    {
      iconUrl: '/movie.svg',
      stat: 'ACTIVE SHOWS',
      statNumber: '48',
      statAmount: 'All systems nominal',
      upOrDownIconUrl: "/check.svg"
    }
  ];

  movies = [
    {
      title: 'Chronicles of Night',
      duration: '142 mins',
      rating: 'PG-13',
      genre: 'Sci-Fi',
      releaseDate: 'Oct 12, 2024',
      status: 'Showing',
      thumbnail: '/spiderman.jpg'
    },
    {
      title: 'The Silent Echo',
      duration: '118 mins',
      rating: 'R',
      genre: 'Thriller',
      releaseDate: 'Sep 28, 2024',
      status: 'Showing',
      thumbnail: '/spiderman.jpg'
    },
    {
      title: 'Skyward Bound',
      duration: '95 mins',
      rating: 'G',
      genre: 'Animation',
      releaseDate: 'Nov 05, 2024',
      status: 'Upcoming',
      thumbnail: '/spiderman.jpg'
    }
  ];

  popularMovies = [
    { title: 'Chronicles of Night', occupancy: 88 },
    { title: 'The Silent Echo', occupancy: 65 },
    { title: 'Midnight Runner', occupancy: 42 },
    { title: 'Galactic Odyssey', occupancy: 30 }
  ];
}
