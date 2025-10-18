import React from "react";
import { connect } from "react-redux";
import { Users, Building2, Shield, TrendingUp } from "lucide-react";
import Layout from "../hocs/Layout";

function Dashboard({ personsCount, towersCount, apartmentsCount }) {
    const stats = [
        {
            title: "Total Personas",
            value: personsCount.toLocaleString(),
            description: "Personas registradas",
            icon: Users,
            trend: "+12%",
        },
        {
            title: "Torres",
            value: towersCount.toString(),
            description: "Torres activas",
            icon: Building2,
            trend: "+3%",
        },
        {
            title: "Departamentos",
            value: apartmentsCount.toString(),
            description: "Departamentos operativos",
            icon: Shield,
            trend: "0%",
        },
        {
            title: "Crecimiento",
            value: "23%",
            description: "Crecimiento mensual",
            icon: TrendingUp,
            trend: "+5%",
        },
    ];

    return (
        <Layout>
            <div className="flex-1 space-y-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
<h1
  className="text-3xl font-extrabold 
             bg-gradient-to-r from-blue-900 via-blue-700 to-blue-500 
             bg-clip-text text-transparent text-outline"
>
  Panel de Control
</h1>

<p
  className="text-lg font-semibold 
             bg-gradient-to-r from-blue-800 to-blue-400 
             bg-clip-text text-transparent text-outline"
>
  HOME-ACCES Security
</p>




                    </div>
                </div>

                {/* Stats Cards (Tailwind, sin UI libs) */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {stats.map((stat) => {
                        const Icon = stat.icon;
                        return (
                            <div
                                key={stat.title}
                                className="bg-white/95 backdrop-blur-sm rounded-lg border border-transparent shadow hover:shadow-md transition-shadow"
                            >
                                <div className="flex flex-row items-center justify-between space-y-0 p-5 pb-2">
                                    <h3 className="text-sm font-medium text-muted-foreground">
                                        {stat.title}
                                    </h3>
                                    <Icon className="h-4 w-4 text-blue-500" /> {/* 🔵 Azul */}
                                </div>
                                <div className="p-5 pt-2">
                                    <div className="text-2xl font-bold text-foreground">
                                        {stat.value}
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <p className="text-xs text-muted-foreground">
                                            {stat.description}
                                        </p>
                                        <span className="text-xs font-medium text-blue-500">
                                            {stat.trend}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                </div>

                {/* Recent Activity + System Summary (sin UI libs, mismo layout) */}
                <div className="grid gap-6 md:grid-cols-2">
                    {/* Actividad Reciente */}
                    <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow border border-transparent">
                        <div className="p-5 pb-2">
                            <h3 className="text-lg font-semibold">Actividad Reciente</h3>
                            <p className="text-sm text-muted-foreground">
                                Últimas acciones en el sistema
                            </p>
                        </div>
                        <div className="p-5">
                            <div className="space-y-4">
                                {[
                                    {
                                        action: "Nueva persona registrada",
                                        user: "Juan Pérez",
                                        time: "Hace 2 minutos",
                                    },
                                    {
                                        action: "Torre actualizada",
                                        user: "Torre Norte",
                                        time: "Hace 15 minutos",
                                    },
                                    {
                                        action: "Departamento creado",
                                        user: "Seguridad",
                                        time: "Hace 1 hora",
                                    },
                                ].map((activity, index) => (
                                    <div key={index} className="flex items-center space-x-4">
                                        <div className="w-2 h-2 bg-primary rounded-full" />
                                        <div className="flex-1 space-y-1">
                                            <p className="text-sm font-medium text-foreground">
                                                {activity.action}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {activity.user} • {activity.time}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Resumen del Sistema */}
                    <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow border border-transparent">
                        <div className="p-5 pb-2">
                            <h3 className="text-lg font-semibold">Resumen del Sistema</h3>
                            <p className="text-sm text-muted-foreground">
                                Estado general de la plataforma
                            </p>
                        </div>
                        <div className="p-5">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">
                                        Estado del servidor
                                    </span>
                                    <span className="text-sm font-medium text-green-600">
                                        Activo
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">
                                        Última sincronización
                                    </span>
                                    <span className="text-sm font-medium text-foreground">
                                        Hace 5 min
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">
                                        Usuarios conectados
                                    </span>
                                    <span className="text-sm font-medium text-foreground">12</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">
                                        Versión del sistema
                                    </span>
                                    <span className="text-sm font-medium text-foreground">
                                        v2.1.0
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

const mapStateToProps = (state) => ({
    personsCount: state.persons?.items?.length || 0,
    towersCount: state.towers?.items?.length || 0,
    apartmentsCount: state.apartments?.items?.length || 0,
});

export default connect(mapStateToProps)(Dashboard);
