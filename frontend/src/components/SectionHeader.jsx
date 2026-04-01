import React from 'react';

const SectionHeader = ({ title, subtitle, icon: Icon, className = "" }) => {
    return (
        <div className={`flex items-center gap-4 mb-8 ${className}`}>
            {Icon && (
                <div className="p-3 bg-primary-50 text-primary-600 rounded-xl shadow-sm border border-primary-100">
                    <Icon className="w-6 h-6" />
                </div>
            )}
            <div>
                <h3 className="text-2xl font-bold text-gray-900 tracking-tight">{title}</h3>
                {subtitle && <p className="text-sm font-medium text-gray-500 mt-1">{subtitle}</p>}
            </div>
        </div>
    );
};

export default SectionHeader;
